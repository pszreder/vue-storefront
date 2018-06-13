var defer = require('config/defer').deferConfig;

module.exports = {
  _substituteSchemeAuthority : defer(function ()  {
    var _get = require('lodash/get');
    var _set = require('lodash/set');

    const url = require('url');

    const endpoints = {
      cart: [
        'create_endpoint', 'updateitem_endpoint', 'deleteitem_endpoint', 'pull_endpoint', 'totals_endpoint', 'paymentmethods_endpoint',
        'shippingmethods_endpoint', 'shippinginfo_endpoint', 'collecttotals_endpoint', 'deletecoupon_endpoint', 'applycoupon_endpoint'
      ],
      users: [
        'endpoint', 'history_endpoint', 'resetPassword_endpoint', 'changePassword_endpoint',
        'login_endpoint', 'create_endpoint', 'me_endpoint', 'refresh_endpoint'
      ]
    }
    
    for (var area in endpoints) {
      let endpointSchemeAuthority = _get(this, area + '.endpoint_scheme_authority');
      if (endpointSchemeAuthority) {
        let endpointSchemeAuthorityUrl = url.parse(endpointSchemeAuthority);

        endpoints[area].forEach(function(endpoint) {
          let configPath = area + '.' + endpoint;

          let endpointUrl = url.parse(_get(this, configPath));
          if (!endpointUrl.host) {
            endpointUrl.protocol = endpointSchemeAuthorityUrl.protocol;
            endpointUrl.auth = endpointSchemeAuthorityUrl.auth;
            endpointUrl.host = endpointSchemeAuthorityUrl.host;
          }

          _set(this, configPath, decodeURI(url.format(endpointUrl)));
        }, this);
      }
    }
  })
}
