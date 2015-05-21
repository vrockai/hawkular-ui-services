/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.

/**
 * @ngdoc provider
 * @name hawkular.rest.HawkularMetric
 * @description
 * # HawkularRest
 * Provider in the hawkular.rest.
 */

module hawkularRest {

  _module.provider('HawkularMetric', function() {

    this.setHost = function(host) {
      this.host = host;
      return this;
    };

    this.setPort = function(port) {
      this.port = port;
      return this;
    };

    this.$get = ['$resource', '$location', function($resource, $location) {

      // If available, used pre-configured values, otherwise use values from current browser location of fallback to
      // defaults
      this.setHost(this.host || $location.host() || 'localhost');
      this.setPort(this.port || $location.port() || 8080);

      var prefix = 'http://' + this.host + ':' + this.port;
      var metricUrlPart = '/hawkular/metrics';
      var url = prefix + metricUrlPart;
      var factory: any = {};

      factory.Tenant = $resource(url + '/tenants', {});

      factory.Metric = $resource(url + '/metrics', { }, {
        queryGauge: {
          method: 'GET',
          isArray: true,
          params: { type: 'gauge' }
        },
        queryAvail: {
          method: 'GET',
          isArray: true,
          params: { type: 'availability' }
        }
      });

      factory.Gauge = $resource(url + '/gauges?tenantId=:tenantId', {
        tenantId : '@tenantId'
      });

      factory.GaugeData = $resource(url + '/gauges/:gaugeId/data?tenantId=:tenantId', {
        tenantId: '@tenantId',
        gaugeId: '@gaugeId'
      }, {
        queryMetrics: {
          method: 'GET',
          isArray: true
        },
        queryMetricsTimeRange: {
          method: 'GET',
          isArray: true,
          params: {buckets: 60, start: '@startTimestamp', end: '@endTimestamp'}
        }
      });

      factory.GaugeDataMultiple = $resource(url + '/gauges/data?tenantId=:tenantId', {
        tenantId : '@tenantId',
        gaugeId: '@gaugeId'
      });

      factory.Availability = $resource(url + '/availability?tenantId=:tenantId', {
        tenantId : '@tenantId',
        gaugeId: '@gaugeId'
      });

      factory.AvailabilityData = $resource(url + '/availability/:availabilityId/data?tenantId=:tenantId', {
        tenantId : '@tenantId',
        availabilityId: '@availabilityId'
      });

      factory.AvailabilityDataMultiple = $resource(url + '/availability/data?tenantId=:tenantId', {
        tenantId : '@tenantId'
      });

      return factory;
    }];

  });
}
