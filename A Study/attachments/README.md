[![Build Status 1.x](https://travis-ci.com/pfizer/pfizer_grv_nextgen-8.svg?token=tLgN9Jx5VZoisnjjo1E6&branch=1.x)](https://travis-ci.com/pfizer/pfizer_grv_nextgen-8)

# Pfizer GRV Nextgen

## Overview
The module provides an integration with GRV Nextgen also known as GRV 5.0.

A base functionality has been taken from the [Janrain Registration](https://www.drupal.org/project/janrain_capture) contrib module of version `8.x-1.0-alpha1`.

The module has an external dependency on [Client for the GRV Backend API](https://github.com/pfizer/grv-backend-api-client).

Most of the frontend assets are dynamically fetched from the `manifest.json` file coming from the GRV application.

A path to the `manifest.json` has a certain structure. The file content and availability can be checked manually by building the link:

`{frontend_hostname}/{app_id}/{app_version}/manifest.json`

The `manifest.json` file structure example:

```
{
    "js": [
        "application.js",
        "analytics.js"
    ],
    "css": {
        "classic": [
            "classic.css"
        ]
    },
    "screens": {
        "en-us": {
            "edit_profile": {
                "classic": "classic-edit_profile-en-us.json"
            },
            "sign_in": {
                "classic": "classic-sign_in-en-us.json"
            }
        }
    }
}
```

## Installation

To use this package, add a dependency to the site profile's `composer.json` require section or run the following command from the main repository's directory to install the module locally:

`composer require pfizer/pfizer_grv_nextgen:VERSION_TAG`

Run the following command to enable the module:

`drush en pfizer_grv_nextgen`

## Configuration

1. Navigate to the `admin/config/people/pfizer-grv-nextgen/settings` page.
2. Click the "Add Settings" link.
3. Fill out required fields of the `General settings` fieldset:
   - **Country Code** - An internal identifier of a country to define settings for. Needed even for a single market setup to initialize a configuration subset.
   - **Country Name** - A human-readable name of a country to define settings for. This is how the country will be represented in a multi market selector.
   - **GRV Nextgen Hostname** - the GRV backend URL. Should be `grv-backend-production.digitalpfizer.com` except certain development purposes. Full list of possible options:
      - grv-backend-staging.digitalpfizer.com
      - grv-backend-uat.digitalpfizer.com
      - grv-backend-production.digitalpfizer.com
   - **Frontend Assets Hostname** - this is where the frontend assets are hosted. The module will use this URL to build a path to the `manifest.json` file which contains all the URLs to CSS, JS assets and to the GRV screens in all the languages. The file structure example is shown above in the overview section. Should be `assets.grv.digitalpfizer.com` except certain development purposes. Full list of possible options:
      - assets-staging.grv.digitalpfizer.com
      - assets-uat.grv.digitalpfizer.com
      - assets.grv.digitalpfizer.com
   - **Application ID** - can be found in the GRV config app.
   - **Application Version** - can also be found in the config app. In case the version is published to the live branch, a branch name from the list with the published version can be used:
      - staging
      - uat
      - production
   - **Client ID** - same as above, this is available in the config app.
   - **Client Secret** - this is available in the config app. Client secret should not be deployed as a plain text. Use [Key's](https://www.drupal.org/project/key) module config override feature described below.
   - **WAF Token Cache Lifetime** - the time in seconds after which the WAF token should be re-requested from GRV Backend. The token is used by Cloudflare to fall in the proper API rate limits for the current user's IP address. Leave blank to use the default value equal to 1 day, or 86400 seconds.
   - **Theme** - this value depends on what theme is chosen for GRV screens in the GRV Config App. In case of classic theme, additional checkbox called `Embed on user pages` is available. It allows to embed view and edit profile screens on default Drupal user profile pages in place of Drupal user view/edit pages output. This checkbox also affects the links in the user block that can either trigger the view/edit profile modals or lead to the appropriate user view/edit profile pages. Please note that embedding will be working only in case "embedded" option is set for appropriate screens in the GRV Config App. This option is available for most of the cases where only the user profile view/edit screens are in embedded mode. The rest, including sign in, register and change password should be modals. There is another option to render the "embedded" block on each page for the case where all/most of the screens should be embedded on a page. In this case the checkbox should be unchecked.

4. Set optional fields if needed:
   - **Email field mapping** - used in cases where GRV Backend returns a user in the payload with the "email" field schema different from the default value. In most cases this should be empty, the "email" schema will be used in this case. The field is visible only in case "Do not store email" checkbox is unchecked.
   - **Do not store email** - an option to not store email addresses in Drupal. In this case the default user email will store `{uuid}@localhost.loc` value. The above field value will not be used.
   - **Embed on user pages** - Check to embed on Drupal user view and edit pages. Check only in case you have configured your edit and view profile forms as embedded in the config app. If checked, the "embedded container" block must not be added to those Drupal user pages. Visible only in case "classic" theme is chosen in the required `Theme` select list.
   - **Mock Identity Provider** - allows to use internal GRV backend storage (backed by S3) of users data instead of calling an IDP such as Janrain. Useful mainly for development purposes if the IDP is not yet configured or the system should be tested without creating real users with the IDP.
   - **Return GRV profile private fields** - allows to request private fields from GRV Backend API and return them within responses. The list of returned private fields is editable in GRV config application. Private fields are only passed to the `hook_pfizer_grv_nextgen_user_authenticated()` hook. Note that private fields cannot be mapped with the "Pfizer GRV Nextgen Mapping" module.
   - **Set IDP Token cookie** - check to set an IDP token cookie once user is authenticated. Be careful since this setting exposes an access token to the client.
   - **IDP Token cookie domain** - provides a way to customize the cookie domain for the IDP token cookie. Leave blank to use the current website's hostname. The textfield is visible only in case the "Set IDP Token cookie" checkbox is checked.
   - **Disable GRV** - check to disable the GRV initialization. This will make the module ignore all the settings. Useful for a multisite setup that shares the same database <br/>when one of the sites does not have GRV but the module is installed. If checked, the GRV init scripts will be stopped at the very early step and all other market settings will be ignored. Typically defined in settings.php as the only setting for the market.
   - **Debug** - logs additional information about sent requests, received responses and possible errors.
5. Another required step to make the module work is to map the locales that are available for the chosen application to current Drupal installation languages. The settings are available in the `Locale settings` fieldset of the same page. It lists all languages available for the current Drupal installation. The list may vary if languages are added/deleted on the `admin/config/regional/language` page. Only the default locale is required. In case it's set, and the rest of the language fields are empty, GRV screens will be rendered in the default locale for all the website languages.
6. Optionally an OIDC enabled app can be configured. Settings are available in the `OIDC settings` fieldset on the same page. Check the "OIDC enabled" checkbox in order to see the required fields. Note that OIDC applications support only the "Nextgen" theme. The only exception is OIDC applications with social connection - these apps can be classic. Social connection can only be configured in case "OIDC Enabled" checkbox is checked. There is an SSO feature available for OIDC apps.
7. Navigate to the `admin/structure/block` page and hit the `Place block` button next to the region name in which the user navigation block should be placed.
8. Choose the `Pfizer GRV Nextgen User Navigation` block and save the block arrangement changes. Now you should see the block that allows anonymous users to sign in and register. It also allows to view, edit profile and sign out for authenticated GRV users. Note that if logged in users haven't been authenticated with GRV, they'll only see the "sign out" link. Also, note that this is not necessary to use this block, a custom solution can be created instead in case advanced styling or different links placement is needed. This block can be used as a reference for the custom code on what exact IDs and what logic the links must have to trigger appropriate actions.
9. Optionally, you can also place the `Pfizer GRV Nextgen Embedded Container` block mentioned in the required fields "Theme" section in case "embedded" mode is chosen for the screens other than "View profile" and "Edit profile" in the GRV Config app. At the moment of writing, most of the cases are covered by the `Embed on user pages` checkbox. This block and the checkbox must not be used together, this will cause conflicts as they both render a container with the same ID and created for different purposes.
10. For a multi market setup, there is also the `Pfizer GRV Nextgen Country Selector` block available. It allows users to switch between existing markets defined in settings. Either the provided block or a custom block based on this block's functional example can be used to switch between markets.

This is the basic setup necessary for GRV screens to be functional.

This is possible to configure as many markets as needed.

For the submodules setup, please check corresponding `README.md` in their root directories.

## Configuration via code

In order to deploy a configuration to a number of environments, this is needed to export a base config file and override specific settings via `settings.{env}.php` with values unique for a certain environment. An example of the entire process, including the configuration of a secure storage for a client secret value, is described on [this page](https://digitalpfizer.atlassian.net/wiki/spaces/GRV/pages/3831595062/Edison+Custom+Drupal+9+configuration+example).

## Permissions

Users that have `Administer GRV Nextgen configuration` permission can access the module's and all its submodules configuration pages.

## Analytics

GRV frontend assets include tracking of Adobe Analytics events. Follow the default analytics scripts [installation guide](https://analytics-support.digitalpfizer.com/hc/en-us/articles/360022518752-Implementation-Guide-Basic-Setup-for-Drupal-8-Sites) in order to set up. Normally you do not need to make any changes if scripts are already present on the website. Note that the website may already have the same events tracking code, in this case it may conflict with the one provided by the module.

## Deployment

The module exports all its configuration into the `pfizer_grv_nextgen.settings.yml` file excluding the block plugins arrangement. You will need to export the configuration, for instance, using the `drush cex` command in order to be able to deploy it.

## Upgrade from the `1.x` version

In order to upgrade the module from `1.x`, the minimum action needed is to just apply the new version of the module. It will work since `2.x` supports the legacy settings structure in a read-only mode. The appropriate warning will be displayed on the settings page. For a proper switching to the new version, the configuration structure update is required. Comparing to legacy, 2 more required fields added:
   - Country code
   - Country name

An example of the legacy `pfizer_grv_nextgen.settings.yml` file:

```
general:
  hostname: hostname.com
  frontend_hostname: assets-hostname.com
  app_id: example-id
  app_version: example-version
  client_id: example-client-id
  client_secret: example-secret
  mock_idp: 1
  debug: 1
  store_no_email: 0
  theme: nextgen
locale:
  default_locale: en-ca
  en: en-us
  fr: fr-be
```

An example of the new structure:

```
countries:
  <COUNTRY-CODE>:
    general:
      country_code: <COUNTRY-CODE>
      country_name: Example country
      hostname: hostname.com
      frontend_hostname: assets-hostname.com
      app_id: example-id
      app_version: example-version
      client_id: example-client-id
      client_secret: example-secret
      mock_idp: 1
      debug: 1
      store_no_email: 0
      theme: nextgen
    locale:
      default_locale: en-ca
      en: en-us
      fr: fr-be
  <COUNTRY-CODE-2>:
    general:
      country_code: <COUNTRY-CODE-2>
      country_name: Example country 2
      hostname: hostname-2.com
      frontend_hostname: assets-hostname-2.com
      app_id: example-id-2
      app_version: example-version-2
      client_id: example-client-id-2
      client_secret: example-secret-2
      mock_idp: 1
      debug: 1
      store_no_email: 0
      theme: nextgen
    locale:
      default_locale: pt-pt
  ...
```

If the country settings are properly defined, the configuration will reflect on the settings page.

In case of upgrading from `1.x`, this is also required to run `drush updb` and `drush cex` locally before deploying changes to apply the `pfizer_grv_nextgen_update_8001()`. This update installs the custom user's UUID field called `field_pfizer_grv_nextgen_uuid`.

## Automated Tests and Code Sniffer
This repository is integrated with [Travis CI](https://travis-ci.com/pfizer/pfizer_grv_nextgen-8) to perform tests and detect Drupal coding standards violations.

***
\* Project generated by [pfizer/pfizer-skel-module-8](https://github.com/pfizer/pfizer-skel-module-8)
