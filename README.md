Titanium CLI Plugin for DeployGate
==================================

A Titanium CLI hook for deploying builds to 
https://deploygate.com/

**Currently, it works only on Mac OS.**


Requirement
-----------

[DeployGate/dgate](https://github.com/DeployGate/dgate) is necessary.

```
$ [sudo] gem install dgate
```

Install
-------

```
$ [sudo] npm i -g umi-uyura/ti-deploygate-hook
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
$ dgate login
```

### Push to DeployGate

Use the `--dgate` flag with the titanium cli to upload to DeployGate.

\* *If `target` is `simulator`, this plugin does nothing.*

```
$ titanium build -p ios --target device --dgate
```

Set optional message using `--dgate` flag and message.

```
$ titanium build -p ios --target device --dgate 'Uploaded from ti-deploygate-hook.'
```

And Android is also similar.

```
$ titanium build -p android --target device --dgate 'Uploaded from ti-deploygate-hook.'
```


Notes
-----

Based on [appcelerator/titanium-cli-plugin-boilerplate](https://github.com/appcelerator/titanium-cli-plugin-boilerplate)

