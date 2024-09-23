import * as React from "react"
import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { findIconDefinition, type IconDefinition, type IconPrefix, type IconName } from '@fortawesome/fontawesome-svg-core'

import "@/lib/fontawesome-library"

type DynamicFaIconProps = {
  iconClassName: string
} & Omit<FontAwesomeIconProps, "icon">

export const DynamicFaIcon = React.memo(({ iconClassName, style, className, width, height, ...props }: DynamicFaIconProps) => {
  let [prefix, iconName] = iconClassName.split(' ')
  if (iconName.startsWith("fa-")) iconName = iconName.substring(3)

  const iconDefinition: IconDefinition | null | undefined = findIconDefinition({
    prefix: prefix as IconPrefix,
    iconName: iconName as IconName
  })

  if (!iconDefinition) return <svg {...{style, className, width, height}} />

  return <FontAwesomeIcon icon={iconDefinition} {...props} />
})
