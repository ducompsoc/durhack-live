import * as React from "react"

import { ConnectionBar } from "@/components/client/connection-bar"
import { ContentContainer } from "@/components/client/content-container"
import { Footer } from "@/components/client/footer"
import { Header } from "@/components/client/header"

const PagesLayout = React.memo(({ children }: React.PropsWithChildren) => {
  return (
    <div>
      <ConnectionBar />
      <Header />

      <div className="m-4 md:mt-8">
        <ContentContainer>{children}</ContentContainer>
      </div>

      <Footer />
    </div>
  )
})

export default PagesLayout
