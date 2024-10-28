import type { CookieConsentConfig } from 'vanilla-cookieconsent'
import { acceptedCategory } from 'vanilla-cookieconsent'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
    gtag: (...args: any[]) => void
  }
}

const updateGtagConsent = () => {
  window.gtag('consent', 'update', {
    ad_storage: acceptedCategory('advertisement') ? 'granted' : 'denied',
    ad_user_data: acceptedCategory('advertisement') ? 'granted' : 'denied',
    ad_personalization: acceptedCategory('advertisement') ? 'granted' : 'denied',
    analytics_storage: acceptedCategory('analytics') ? 'granted' : 'denied',
  })
}

export const config: CookieConsentConfig = {
  root: '#cc-container', // Important, generate the html inside a common/persistent element
  onConsent: () => {
    updateGtagConsent()
  },
  onChange: () => {
    updateGtagConsent()
  },
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom left',
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^_ga/, // regex: match all cookies starting with '_ga'
          },
          {
            name: '_gid', // string: exact cookie name
          },
        ],
      },

      // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
      services: {
        ga: {
          label: 'Google Analytics',
          cookies: [
            {
              name: /^(_ga|_gid)/,
            },
          ],
        },
      },
    },
    advertisement: {},
  },
  language: {
    default: 'en',
    autoDetect: 'browser',
    translations: {
      en: {
        consentModal: {
          title: 'We use cookies',
          description:
            'Hello, this website uses essential cookies to ensure its proper functioning and tracking cookies to understand how you interact with it. The latter is only set after permission.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
        },
        preferencesModal: {
          title: 'Consent Preferences Center',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close modal',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              title: 'Your Privacy Choices',
              description: `We use cookies to ensure basic website functionality and to improve your online experience. You can choose to opt in or out of each category whenever you want.`,
            },
            {
              title: 'Necessary',
              description:
                'Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Analytics',
              description:
                'Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Service',
                  description: 'Description',
                  expiration: 'Expiration',
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description: 'Cookie set by <a href="#das">Google Analytics</a>',
                    expiration: 'Expires after 12 days',
                  },
                  {
                    name: '_gid',
                    domain: 'Google Analytics',
                    description: 'Cookie set by <a href="#das">Google Analytics</a>',
                    expiration: 'Session',
                  },
                ],
              },
            },
            {
              title: 'Advertisement',
              description:
                'Advertisement cookies are used to provide visitors with customized advertisements based on the pages you visited previously and to analyze the effectiveness of the ad campaigns.',
              linkedCategory: 'advertisement',
            },
            {
              title: 'More information',
              // description: 'For any queries in relation to our policy on cookies and your choices, please <a href="/contact">contact us</a>.',
              description: 'For any queries in relation to our policy on cookies and your choices, please contact us.',
            },
          ],
        },
      },
    },
  },
}
