[![Testing](https://github.com/pfizer/pfizer_key-8/actions/workflows/testing.yml/badge.svg)](https://github.com/pfizer/pfizer_key-8/actions)

# Pfizer Key

Provides a custom PfizerKeyProvider that all keys should be based on.

Pfizer Keys are stored outside the web root.  Keys can be site wide or environment specific.

## Dependencies

- [Key](https://www.drupal.org/project/key)

## Existing Keys

- [Cloudflare \(Pfizer Performance\)](https://github.com/pfizer/pfizer_performance-8/)
- [Pfizer Encrypt](https://github.com/pfizer/pfizer_encrypt-8/)
- [Pfizer SmartSite](https://github.com/pfizer/pfizer_smartsite-8)

## Creating keys

To Create a new key, navigate to the key creation page: `/admin/config/system/keys/add`

- Add the name of the new key
- Select Key type (see below)
- Select Pfizer Key as the key provider
- Save the form

This will create a new configuration object that will need to be exported with 'drush cex' and committed to the profile repository.

**Note: A corresponding key with the name `[key_name].key` needs to be placed on the Acquia server.  Please email Support at `DL-BT-DIGITALMARKETING@pfizer.com` to request this be done.

### Site wide keys

Keys that will be the same across all environments.  

The KeyType plugins supported:  
- `authentication`
- `encryption`

*note: Pfizer Encrypt already provides a default encryption key, so the most used KeyType for site wide keys is `authentication`

### Environment specific keys

Keys that will be different per environment.

The KeyType plugins supported:
- `pfizer_environment`

## Access Keys
   
To access keys, use the `key.repository` service.  If you are calling from a php class, you should inject the key.repository service and assign it to a variable.  

A key value can be fetch and used in code by calling: 
   
```$keyRepository->getKey(['key_name'])->getKeyValue();```
   
If calling from a module file, you can use
   
```\Drupal::service('key.repository')->getKey('[key_name]')->getKeyValue();```

## Using keys on local environment
On local environment, the module will look for keys in the folder `<site root folder>/.pfizer`.
To change location of the keys folder, update the settings `pfizer_key_directory` in the `settings.local.php` file.

Example:
```
$settings['pfizer_key_directory'] = '/home/user/.pfizer/keys';
```
