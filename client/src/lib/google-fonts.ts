import { Audiowide, Inter, Space_Grotesk } from "next/font/google"

export const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--durhack-font",
})

export const inter = Inter({ subsets: ["latin"] })

export const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })
