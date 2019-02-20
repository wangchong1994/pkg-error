export default function YpI18n(locale) {
  return new Promise((resolve) => {
    switch (locale) {
      case 'zh-CN':
        import( /* webpackChunkName: "yp.zh-CN" */ './i18n/zh-CN.json')
          .then(lang => {
            resolve(lang);
          })
        break;
      case 'en':
        import( /* webpackChunkName: "yp.en" */ './i18n/en.json')
          .then(lang => {
            resolve(lang);
          })
        break;
    }
  })
}