Titanium CLI Plugin for DeployGate
==================================

A Titanium CLI hook for deploying builds to <https://deploygate.com/>

**Currently, it works only on Mac OS.**


Requirement
-----------

[DeployGate/deploygate-cli](https://github.com/DeployGate/deploygate-cli) or [DeployGate/dgate](https://github.com/DeployGate/dgate) is necessary. ( **Recommended deploygate-cli.** )

Please refer to the details <https://deploygate.com/docs/cli>.


Install
-------

```
$ [sudo] npm i -g ti-deploygate-hook
ti-deploygate-hook hook installed
```

If this message *"ti-deploygate-hook hook installed"* does not appear, please try running the following command.

```
$ ti-deploygate-hook
```


Usage
-----

### (Before you use) Login to DeployGate

```
$ dg login --terminal
```

or

```
$ dgate login
```

### Push to DeployGate

Use the `--dg` flag with the titanium cli to upload to DeployGate.

\* *If you use `dgate` command , please read as `--dg` to` --dgate`.*

```
$ titanium build -p ios --target device --dg
```

Set optional message using `--dg` flag and message.

```
$ titanium build -p ios --target device --dg 'Uploaded from ti-deploygate-hook.'
```

And Android is also similar.

```
$ titanium build -p android --target device --dg 'Uploaded from ti-deploygate-hook.'
```

\* *If `target` is `simulator`, this plugin does nothing.*


Notes
-----

Based on [appcelerator/titanium-cli-plugin-boilerplate](https://github.com/appcelerator/titanium-cli-plugin-boilerplate)

