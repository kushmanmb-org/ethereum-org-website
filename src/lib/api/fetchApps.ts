import { AppCategoryEnum, AppData } from "@/lib/types"

export async function fetchApps(): Promise<Record<string, AppData[]>> {
  const googleApiKey = process.env.GOOGLE_API_KEY
  const sheetId = process.env.GOOGLE_SHEET_ID_DAPPS

  if (!sheetId) {
    throw new Error("Google Sheets ID not set")
  }

  if (!googleApiKey) {
    throw new Error("Google API key not set")
  }

  try {
    // First, let's get the spreadsheet metadata to see what sheets exist
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${googleApiKey}`

    const metadataResponse = await fetch(metadataUrl)

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text()
      console.error("Metadata fetch error:", {
        status: metadataResponse.status,
        statusText: metadataResponse.statusText,
        error: errorText,
      })
      throw new Error(
        `Metadata fetch failed: ${metadataResponse.status} ${metadataResponse.statusText}`
      )
    }

    const metadata = await metadataResponse.json()
    const sheetNames =
      metadata.sheets?.map(
        (sheet: { properties: { title: string } }) => sheet.properties.title
      ) || []

    // Filter out sheets that are not valid AppCategoryEnum values
    const appCategorySheetNames = sheetNames.filter((name: string) =>
      Object.values(AppCategoryEnum).includes(name as AppCategoryEnum)
    )

    const appsOfTheWeek = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/App%20of%20the%20day!A2:C?majorDimension=ROWS&key=${googleApiKey}`
    )

    if (!appsOfTheWeek.ok) {
      console.error(
        `Failed to fetch from sheet Apps of the day:`,
        appsOfTheWeek.status,
        appsOfTheWeek.statusText
      )
    }

    const appsOfTheWeekData = await appsOfTheWeek.json()

    // Create a Map for O(1) lookups of app of the week data
    const appsOfTheWeekMap = new Map<string, [string, string, string]>()
    if (appsOfTheWeekData.values) {
      appsOfTheWeekData.values.forEach((app: [string, string, string]) => {
        if (app[0]) {
          appsOfTheWeekMap.set(app[0], app)
        }
      })
    }

    // Fetch all sheets in parallel for better performance
    const sheetFetches = appCategorySheetNames.map(async (sheetName) => {
      const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:Z?majorDimension=ROWS&key=${googleApiKey}`

      try {
        const dataResponse = await fetch(dataUrl)

        if (!dataResponse.ok) {
          console.error(
            `Failed to fetch from sheet ${sheetName}:`,
            dataResponse.status,
            dataResponse.statusText
          )
          return { sheetName, apps: [] }
        }

        const data = await dataResponse.json()
        const rows = data.values || []

        if (rows.length === 0) {
          return { sheetName, apps: [] }
        }

        // Process data rows (skip header)
        const dataRows = rows.slice(1).filter((row: string[]) => {
          // Filter out completely empty rows or rows without a name
          return row.length > 0 && row[0]?.trim() !== ""
        })

        const apps: AppData[] = dataRows
          .map((row: string[]) => {
            // Map row data to app object
            const appData = {
              name: row[0] || "",
              url: row[1] || "",
              description: row[2] || "",
              image: row[3] || "", // Use the SVG data directly from the Logo Image column
              category: getCategoryFromSheetName(sheetName),
              subCategory: parseCommaSeparated(row[5] || ""),
              networks: parseCommaSeparated(row[6] || ""),
              screenshots: parseCommaSeparated(row[7] || ""),
              bannerImage: row[8] || "",
              platforms: parseCommaSeparated(row[9] || ""),
              twitter: row[10] || "",
              github: row[11] || "",
              discord: row[12] || "",
              kpiUrl: row[13] || "",
              sortingWeight: parseInt(row[14] || "0") || 0,
              discover: row[15]?.toLowerCase() === "true",
              highlight: row[16]?.toLowerCase() === "true",
              languages: parseCommaSeparated(row[17] || ""),
              parentCompany: row[18] || "",
              parentCompanyURL: row[19] || "",
              openSource: row[20]?.toLowerCase() === "true",
              contractAddress: row[21] || "",
              dateOfLaunch: row[22] || "",
              lastUpdated: row[23] || "",
              ready: row[24]?.toLowerCase(),
              devconnect: row[25]?.toLowerCase(),
              ...parseAppOfTheWeekDate(row[0], appsOfTheWeekMap),
            }

            return appData as unknown as AppData
          })
          .filter((app: AppData) => app.name && app.url) // Filter out apps without name or URL
          .filter((app: AppData) => app.ready === "true")

        return { sheetName, apps }
      } catch (error) {
        console.error(`Error processing sheet ${sheetName}:`, error)
        return { sheetName, apps: [] }
      }
    })

    // Wait for all fetches to complete in parallel
    const sheetResults = await Promise.all(sheetFetches)

    // Build result object from parallel fetch results
    const result: Record<string, AppData[]> = {}
    sheetResults.forEach(({ sheetName, apps }) => {
      result[sheetName] = apps
    })

    return result
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error)
    return {}
  }
}

// Helper function to map sheet names to AppCategoryEnum
function getCategoryFromSheetName(sheetName: string): AppCategoryEnum {
  switch (sheetName) {
    case "DeFi":
      return AppCategoryEnum.DEFI
    case "Collectibles":
      return AppCategoryEnum.COLLECTIBLE
    case "Social":
      return AppCategoryEnum.SOCIAL
    case "Gaming":
      return AppCategoryEnum.GAMING
    case "Bridge":
      return AppCategoryEnum.BRIDGE
    case "Productivity":
      return AppCategoryEnum.PRODUCTIVITY
    case "Privacy":
      return AppCategoryEnum.PRIVACY
    case "DAO":
      return AppCategoryEnum.GOVERNANCE_DAO
    default:
      return AppCategoryEnum.DEFI // Default fallback
  }
}

// Helper function to parse comma-separated strings into arrays
function parseCommaSeparated(value: string): string[] {
  if (!value || value.trim() === "") return []
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

const parseAppOfTheWeekDate = (
  appName: string,
  appsOfTheWeekMap: Map<string, [string, string, string]>
): { appOfTheWeekStartDate: Date | null; appOfTheWeekEndDate: Date | null } => {
  const appOfTheWeek = appsOfTheWeekMap.get(appName)
  return {
    appOfTheWeekStartDate: appOfTheWeek ? new Date(appOfTheWeek[1]) : null,
    appOfTheWeekEndDate: appOfTheWeek ? new Date(appOfTheWeek[2]) : null,
  }
}
