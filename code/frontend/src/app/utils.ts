export function toTitleCasePreserveCode(input: string): string {
  return input.replace(/([^(]+)(\s*\(.*\))?/, (_, namePart: string, codePart: string) => {
    const titled = namePart
      .toLowerCase()
      .replace(/(^|[-\u2012-\u2015\s])\w/gu, m => m.toUpperCase())
    return titled + (codePart ?? '')
  })
}
