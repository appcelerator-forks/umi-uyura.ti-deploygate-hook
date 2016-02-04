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
  cli.on('build.finalize', function () {
    logger.debug('DeployGate Plugin: dg = ' + cli.argv.dg + ' / dgate = ' + cli.argv.dgate);

    if (undefined === cli.argv.dg && undefined === cli.argv.dgate) {
      return;
    }

    var command = (undefined !== cli.argv.dg) ? 'dg' : 'dgate';
    logger.debug('DeployGate Plugin: Use command = ' + command);

    var dg = cli.argv.dg || '';
    var dgate = cli.argv.dgate || '';

    var message = dg || dgate;
    logger.debug('DeployGate Plugin: message = ' + message);

    var target_path = getTargetPath(logger,
                                    cli.sdk.manifest.version,
                                    cli.tiapp.name,
                                    cli.argv.platform,
                                    cli.argv.target);
    if (!target_path) {
      return;
    }

    pushDeployGate(logger,
                   target_path,
                   cli.argv['project-dir'],
                   command,
                   message);
  });
};

/**
 * Get app binary path
 *
 * @param {Object} logger - The logger instance
 * @param {String} version - SDK Version
 * @param {String} name - Application name (base for binary file name）
 * @param {String} platform - Platform name
 * @param {String} target - Target build platform
 */
function getTargetPath(logger, version, name, platform, target) {
  var apppath = null;

  logger.debug('DeployGate Plugin: Platform = ' + platform + ', target = ' + target);

  if ('ios' === platform || 'iphone' === platform || 'ipad' === platform) {
    if ('simulator' === target) {
      logger.info('DeployGate Plugin: In the case of simulator, plugin does not perform');
      return '';
    }
    apppath = '/build/iphone/build/';
    if (5.0 <= parseFloat(version)) {
      logger.debug('DeployGate Plugin: Titanium SDK 5.0 or later');
      apppath = path.join(apppath, 'Products');
    }
    apppath = path.join(apppath, ('device' === target ? 'Debug' : 'Release') + '-iphoneos/' + name + '.ipa');
  } else if ('android' === platform) {
    apppath = path.join('/build/android/bin/', name + '.apk');
  } else {
    logger.info('DeployGate Plugin: Platform "' + platform + '" is not a target');
    return '';
  }

  return apppath;
}

/**
 * Push to DeployGate
 *
 * @param {Object} logger - The logger instance
 * @param {String} path - Binary file path
 * @param {String} project_dir - Project directory path
 * @param {String} command - Optional message of this push
 * @param {String} message - Optional message of this push
 */
var pushDeployGate = function(logger, path, project_dir, command, message) {
  var commands = [
    { command: 'dg', subcommand: 'deploy' },
    { command: 'dgate', subcommand: 'push' }
  ];

  var push_command = null;
  for (var i = 0; i < commands.length; i++) {
    if (command === commands[i].command) {
      push_command = commands[i];
      break;
    }
  }

  if (!push_command) {
    logger.error('DeployGate Plugin: Unkown push command - ' + command);
    return;
  }

  var dg_command = push_command.command + ' ' + push_command.subcommand + ' "' + project_dir + path + '"';
  if (message) {
    dg_command += ' --message "' + message + '"';
  }
  logger.debug('DeployGate Plugin: execute = ' + dg_command);

  exec(dg_command, function(error, stdout, stderr) {
    if (error) {
      logger.error('DeployGate Plugin: Push failed');
      if (stderr) {
        logger.error(stderr);
      }
    }

    logger.info(stdout);
  });
};
