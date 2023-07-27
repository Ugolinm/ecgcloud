import { defineRouter as router1 } from "./pat_app"
import { defineRouter as router2 } from "./doc_web"

export function router(app: any) {
  /** common entry */
  app.all('*', async (req: any, res: any, next: any) => {
    // TODO:
    next()
  })

  // define pat app router
  router1(app, "/patz_app")
  // define doc web router
  router2(app, "/doc_web")
}