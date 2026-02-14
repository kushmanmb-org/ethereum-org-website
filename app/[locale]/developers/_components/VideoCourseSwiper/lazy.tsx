import createLazyComponent from "@/lib/utils/createLazyComponent"

import Loading from "./loading"

export default createLazyComponent(() => import("."), Loading)
