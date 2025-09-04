import { typographyConst } from '@/features/theming/constants/themingConst';

/**
 * Creates the font face CSS declarations for specific font family
 * @param fontFamily - The font family name to use in CSS
 * @returns CSS string with all @font-face declarations
 */
export const createFontFaceDeclarations = (fontFamily: string): string => {
  return `
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontBlackOblique}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontBlackOblique}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontBlackOblique}.ttf') format('truetype');
      font-weight: 900;
      font-style: oblique;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontBlackRotalic}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontBlackRotalic}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontBlackRotalic}.ttf') format('truetype');
      font-weight: 900;
      font-style: italic;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontBlack}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontBlack}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontBlack}.ttf') format('truetype');
      font-weight: 900;
      font-style: normal;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontBoldOblique}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontBoldOblique}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontBoldOblique}.ttf') format('truetype');
      font-weight: bold;
      font-style: oblique;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontBoldRotalic}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontBoldRotalic}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontBoldRotalic}.ttf') format('truetype');
      font-weight: bold;
      font-style: italic;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontBold}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontBold}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontBold}.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontLazerOblique}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontLazerOblique}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontLazerOblique}.ttf') format('truetype');
      font-weight: 500;
      font-style: oblique;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontLazerRotalic}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontLazerRotalic}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontLazerRotalic}.ttf') format('truetype');
      font-weight: 500;
      font-style: italic;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontLazer}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontLazer}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontLazer}.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontLightOblique}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontLightOblique}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontLightOblique}.ttf') format('truetype');
      font-weight: 300;
      font-style: oblique;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontLightRotalic}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontLightRotalic}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontLightRotalic}.ttf') format('truetype');
      font-weight: 300;
      font-style: italic;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontLight}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontLight}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontLight}.ttf') format('truetype');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontMediumOblique}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontMediumOblique}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontMediumOblique}.ttf') format('truetype');
      font-weight: 500;
      font-style: oblique;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontMediumRotalic}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontMediumRotalic}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontMediumRotalic}.ttf') format('truetype');
      font-weight: 500;
      font-style: italic;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontMedium}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontMedium}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontMedium}.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontRegularOblique}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontRegularOblique}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontRegularOblique}.ttf') format('truetype');
      font-weight: 400;
      font-style: oblique;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontRegularRotalic}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontRegularRotalic}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontRegularRotalic}.ttf') format('truetype');
      font-weight: 400;
      font-style: italic;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontRegular}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontRegular}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontRegular}.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontThinOblique}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontThinOblique}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontThinOblique}.ttf') format('truetype');
      font-weight: 100;
      font-style: oblique;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontThinRotalic}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontThinRotalic}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontThinRotalic}.ttf') format('truetype');
      font-weight: 100;
      font-style: italic;
    }
    @font-face {
      font-family: '${fontFamily}';
      src: url('${typographyConst.fontPaths.fontThin}.woff2') format('woff2'),
           url('${typographyConst.fontPaths.fontThin}.woff') format('woff'),
           url('${typographyConst.fontPaths.fontThin}.ttf') format('truetype');
      font-weight: 100;
      font-style: normal;
    }
  `;
};
