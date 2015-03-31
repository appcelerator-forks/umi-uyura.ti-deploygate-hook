/**
 * Hook to push to DeployGate
 *
 * @copyright
 * Copyright (c) 2015 by Umi Uyura. All Rights Reserved.
 */

'use strict';

var exec = require('child_process').exec,
    path = require('path');

/** The plugin's identifier */
// exports.id = 'com.example.hook';

/** The Titanium CLI version that this hook is compatible with */
exports.cliVersion = '>=3.2';

/**
 * Initialize the hook.
 *
 * @param {Object} logger - The logger instance
 * @param {Object} config - The CLI config object
 * @param {CLI} cli - The CLI instance
 * @param {Object} appc - The node-appc library
 */
exports.init = function init(logger, config, cli, appc) {
  cli.on('cli:post-validate', function() {
    logger.info('DeployGate Plugin: loaded');
  });
  cli.on('build.finalize', function () {
    if (undefined !== cli.argv.dgate) {
      dgatePush(logger,
                cli.tiapp.name,
                cli.argv['project-dir'],
                cli.argv.platform,
                cli.argv.target,
                cli.argv.dgate);
    }
  });
};

/**
 * Push to DeployGate
 *
 * @param {Object} logger - The logger instance
 * @param {String} name - Application name (base for binary file name）
 * @param {String} project_dir - Project directory path
 * @param {String} platform - Platform name
 * @param {String} target - Target build platform
 * @param {String} message - Optional message of this push
 */
var dgatePush = function(logger, name, project_dir, platform, target, message) {
  var appfile = null;

  logger.debug('DeployGate Plugin: Platform = ' + platform + ', target = ' + target);

  if ('ios' === platform || 'iphone' === platform || 'ipad' === platform) {
    if ('simulator' === target) {
      logger.info('DeployGate Plugin: In the case of simulator, plugin does not perform');
      return;
    }
    appfile = '/build/iphone/build/' + ('device' === target ? 'Debug' : 'Release') + '-iphoneos/' + name + '.ipa';
  } else if ('android' === platform) {
    appfile = '/build/android/bin/' + name + '.apk';
  } else {
    logger.info('DeployGate Plugin: Platform "' + platform + '" is not a target');
    return;
  }

  var push_cmd = 'dgate push "' + project_dir + appfile + '"';
  if (message) {
    push_cmd += ' -m "' + message + '"';
  }
  logger.debug(push_cmd);

  exec(push_cmd, function(error, stdout, stderr) {
    if (error) {
      logger.error('DeployGate Plugin: Push failed');
      if (stderr) {
        logger.error(stderr);
      }
    }

    logger.info(stdout);
  });
};
