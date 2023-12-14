import { Environment } from "@prisma/client";
import { src_3 } from "./src_3";
import { src_5 } from "./src_5";

const VERCEL_URL = process.env.VERCEL_URL!;
const ENV = process.env.VERCEL_ENV as Environment;
const API_URL =
  ENV === "production" ? "https://pro-it-schhol.vercel.app/" : VERCEL_URL;

const src_1 =
  "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";

const src_2 =
  "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";

const src_4 =
  "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";

export const getEmailHtml = ({
  name,
}: {
  name: string;
}) => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>
  
    <style type="text/css">
      @media only screen and (min-width: 620px) {
  .u-row {
    width: 600px !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-100 {
    width: 600px !important;
  }

}

@media (max-width: 620px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: 100% !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
}
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

@media (max-width: 480px) {
  .hide-mobile {
    max-height: 0px;
    overflow: hidden;
    display: none !important;
  }
}

table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 87% !important; } #u_content_heading_1 .v-container-padding-padding { padding: 40px 10px 0px !important; } #u_content_text_2 .v-container-padding-padding { padding: 5px 10px 10px !important; } #u_content_text_deprecated_1 .v-container-padding-padding { padding: 40px 10px 10px !important; } #u_content_menu_1 .v-padding { padding: 5px 10px !important; } }
    </style>
  
  

<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ecf0f1;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ecf0f1;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ecf0f1;"><![endif]-->
    
  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table id="u_content_image_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:60px 0px 0px;font-family:'Raleway',sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
      
      <img align="center" border="0" src="data:image/png;base64, ${src_5}" alt="image" title="image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 74%;max-width: 444px;" width="444" class="v-src-width v-src-max-width"/>
      
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Raleway',sans-serif;" align="left">
        
  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 3px solid #ecf0f1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <span>&#160;</span>
        </td>
      </tr>
    </tbody>
  </table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table id="u_content_heading_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 5px;font-family:'Raleway',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 style="margin: 0px; color: #f35900; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Playfair Display',serif; font-size: 26px; font-weight: 400;"><strong>Привет ${name}!</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_2" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 50px 10px;font-family:'Raleway',sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 140%;">Рады тебя видеть частью нашей большой команды интересующейся астрологией.</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Raleway',sans-serif;" align="left">
        
  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
<div align="center">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.unlayer.com" style="height:37px; v-text-anchor:middle; width:162px;" arcsize="11%"  stroke="f" fillcolor="#f35900"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
    <a href=${API_URL} target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #f35900; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
      <span class="v-padding" style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Вернуться на сайт</span></span>
    </a>
    <!--[if mso]></center></v:roundrect><![endif]-->
</div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table id="u_content_text_deprecated_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:40px 80px 10px;font-family:'Raleway',sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 160%;">Если у тебя есть какие-либо вопросы, ты можешь обраться ко мне в социальных сетях.</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 0px;font-family:'Raleway',sans-serif;" align="left">
        
  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <span>&#160;</span>
        </td>
      </tr>
    </tbody>
  </table>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Raleway',sans-serif;" align="left">
        
<div align="center">
  <div style="display: table; max-width:187px;">
  <!--[if (mso)|(IE)]><table width="187" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;"><tr><![endif]-->
  
    
    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://www.facebook.com/unlayer" title="Facebook" target="_blank">
          <img src="data:image/png;base64, ${src_2}" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td><![endif]-->
    
    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://twitter.com/unlayerapp" title="Twitter" target="_blank">
          <img src="data:image/png;base64, ${src_1}" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td><![endif]-->
    
    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://www.linkedin.com/in/tatsiana-bykava-4bba1124b/" title="LinkedIn" target="_blank">
          <img src="data:image/png;base64, ${src_4}" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td><![endif]-->
    
    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://www.instagram.com/unlayer_official/" title="Instagram" target="_blank">
          <img src="data:image/png;base64, ${src_3}" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td><![endif]-->
    
    
    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
  </div>
</div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_menu_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Raleway',sans-serif;" align="left">
        
<div class="menu" style="text-align:center">
<!--[if (mso)|(IE)]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"><tr><![endif]-->

  <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
  
    <a href=${API_URL} target="_self" style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;text-decoration:none"  class="v-padding">
      Главная
    </a>
  
  <!--[if (mso)|(IE)]></td><![endif]-->
  
    <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
    <span style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;" class="v-padding hide-mobile">
      |
    </span>
    <!--[if (mso)|(IE)]></td><![endif]-->
  

  <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
  
    <a href="${API_URL}/course" target="_self" style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;text-decoration:none"  class="v-padding">
      Курсы
    </a>
  
  <!--[if (mso)|(IE)]></td><![endif]-->
  
    <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
    <span style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;" class="v-padding hide-mobile">
      |
    </span>
    <!--[if (mso)|(IE)]></td><![endif]-->
  

  <!--[if (mso)|(IE)]><td style="padding:5px 15px"><![endif]-->
  
    <a href="${API_URL}" target="_self" style="padding:5px 15px;display:inline-block;color:#000000;font-size:14px;text-decoration:none"  class="v-padding">
      О мне
    </a>
  
  <!--[if (mso)|(IE)]></td><![endif]-->
    

<!--[if (mso)|(IE)]></tr></table><![endif]-->
</div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 40px;font-family:'Raleway',sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 160%;">Ты получил это письмо так как прошел регистрацию на <a rel="noopener" href="${API_URL}" target="_blank">${API_URL}</a>.</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>
`;
