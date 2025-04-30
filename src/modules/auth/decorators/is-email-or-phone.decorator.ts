import {
  isEmail,
  isMobilePhone,
  isNotEmpty,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export type MobilePhoneLocale =
  | 'am-AM'
  | 'ar-AE'
  | 'ar-BH'
  | 'ar-DZ'
  | 'ar-LB'
  | 'ar-EG'
  | 'ar-IQ'
  | 'ar-JO'
  | 'ar-KW'
  | 'ar-LY'
  | 'ar-MA'
  | 'ar-OM'
  | 'ar-SA'
  | 'ar-SY'
  | 'ar-TN'
  | 'az-AZ'
  | 'bs-BA'
  | 'be-BY'
  | 'bg-BG'
  | 'bn-BD'
  | 'ca-AD'
  | 'cs-CZ'
  | 'da-DK'
  | 'de-DE'
  | 'de-AT'
  | 'de-CH'
  | 'de-LU'
  | 'el-GR'
  | 'en-AU'
  | 'en-GB'
  | 'en-GG'
  | 'en-GH'
  | 'en-HK'
  | 'en-MO'
  | 'en-IE'
  | 'en-IN'
  | 'en-KE'
  | 'en-MT'
  | 'en-MU'
  | 'en-NG'
  | 'en-NZ'
  | 'en-PK'
  | 'en-PH'
  | 'en-RW'
  | 'en-SG'
  | 'en-SL'
  | 'en-TZ'
  | 'en-UG'
  | 'en-US'
  | 'en-ZA'
  | 'en-ZM'
  | 'en-ZW'
  | 'es-AR'
  | 'es-BO'
  | 'es-CO'
  | 'es-CL'
  | 'es-CR'
  | 'es-DO'
  | 'es-HN'
  | 'es-EC'
  | 'es-ES'
  | 'es-GT'
  | 'es-PE'
  | 'es-MX'
  | 'es-PA'
  | 'es-PY'
  | 'es-UY'
  | 'es-VE'
  | 'et-EE'
  | 'fa-IR'
  | 'fi-FI'
  | 'fj-FJ'
  | 'fo-FO'
  | 'fr-FR'
  | 'fr-GF'
  | 'fr-GP'
  | 'fr-MQ'
  | 'fr-RE'
  | 'he-IL'
  | 'hu-HU'
  | 'id-ID'
  | 'it-IT'
  | 'it-SM'
  | 'ja-JP'
  | 'ka-GE'
  | 'kk-KZ'
  | 'kl-GL'
  | 'ko-KR'
  | 'lt-LT'
  | 'lv-LV'
  | 'mk-MK'
  | 'ms-MY'
  | 'mz-MZ'
  | 'nb-NO'
  | 'ne-NP'
  | 'nl-BE'
  | 'nl-NL'
  | 'nn-NO'
  | 'pl-PL'
  | 'pt-BR'
  | 'pt-PT'
  | 'pt-AO'
  | 'ro-RO'
  | 'ru-RU'
  | 'si-LK'
  | 'sl-SI'
  | 'sk-SK'
  | 'sq-AL'
  | 'sr-RS'
  | 'sv-SE'
  | 'th-TH'
  | 'tr-TR'
  | 'uk-UA'
  | 'uz-UZ'
  | 'vi-VN'
  | 'zh-CN'
  | 'zh-TW';

@ValidatorConstraint()
export class isEmailOrPhone implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    const locale = args.constraints[0] as MobilePhoneLocale;
    return isNotEmpty(value) && (isEmail(value) || isMobilePhone(value, locale));
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `$property must be an valid email or a phone number`;
  }
}

export function IsEmailOrPhone(locale?: MobilePhoneLocale, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [locale],
      validator: isEmailOrPhone,
    });
  };
}
