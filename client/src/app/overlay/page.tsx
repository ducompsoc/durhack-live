import dynamic from "next/dynamic"

const LivestreamOverlayClient = dynamic(() => import("./page-client"), {
  ssr: false,
})

export default function LivestreamOverlay() {
  return <LivestreamOverlayClient />
}
