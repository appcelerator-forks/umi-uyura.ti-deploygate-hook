/**
 * Hook to push to DeployGate
 *
 * @copyright
 * Copyright (c) 2015 by Umi Uyura. All Rights Reserved.
 */

'use strict';

var exec = require('child_process').exec;

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
    var message = cli.argv.dg || cli.argv.dgate;
    if (!message) {
      return;
    }

    var path = getTargetPath(logger,
                             cli.sdk.manifest.version,
                             cli.tiapp.name,
                             cli.argv.platform,
                             cli.argv.target);
    if (!path) {
      return;
    }

    var command = cli.argv.dg ? 'dg' : 'dgate';

    pushDeployGate(logger,
                   path,
                   cli.argv['project-dir'],
                   cli.argv.target,
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
  var appfile = null;

  logger.debug('DeployGate Plugin: Platform = ' + platform + ', target = ' + target);

  if ('ios' === platform || 'iphone' === platform || 'ipad' === platform) {
    if ('simulator' === target) {
      logger.info('DeployGate Plugin: In the case of simulator, plugin does not perform');
      return '';
    }
    appfile = '/build/iphone/build/';
    if (5.0 <= parseFloat(version)) {
      logger.debug('DeployGate Plugin: Titanium SDK 5.0 or later');
      appfile += 'Products/';
    }
    appfile += ('device' === target ? 'Debug' : 'Release') + '-iphoneos/' + name + '.ipa';
  } else if ('android' === platform) {
    appfile = '/build/android/bin/' + name + '.apk';
  } else {
    logger.info('DeployGate Plugin: Platform "' + platform + '" is not a target');
    return '';
  }

  return appfile;
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
  logger.debug(dg_command);

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
