# homebridge-inels

[Homebridge](https://homebridge.io) plugin for [iNels](https://www.inels.com) devices.

> **⚠️ Warning ⚠️**
> This is in the really early stage of development.
> **Use with caution**

## TODO:

- [ ] Differentiate types of devices
- [ ] Add support for event handlers for different characteristics
- [ ] ~~Improve typings~~
- [ ] Rewrite into ReasonML
- [ ] Improve API

## How to make run

1. Get some [iNels accessories](http://eshop.elkoep.com)
2. Get one of their Smart boxes ([like this one](https://www.elkoep.com/smart-rf-box-elan-rf-003))
3. Install [Homebridge](https://homebridge.io), eg. on [Raspberry PI](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi)
4. Install this plugin with yarn or npm (in most cases you want to install it globally, therefore `global`/ `-g` parameter):
   `yarn global add homebridge-inels` or `npm install -g homebridge-inels`
5. Configure your devices in Smart box
6. Set static IP to your Smart box
7. Config `config.json`:
   1. Into platforms section add:

```json
{
  "platform": "iNELS",
  "ipAddress": "192.168.0.1",
  "username": "username",
  "password": "some_password"
}
```

Where:

- `ipAddress`: Well, IP address of your Smart box
- `username` and `password`: Credentials for login to your smart box - you should create new user without admin privileges for this plugin.

> **Disclaimer**
> This plugin is not substitution for [iNels official app](https://itunes.apple.com/cz/app/inels-home-control-rf/id1189384684), there is functionality that this plaugin can never have
> I'm not employee or in any other relation with iNELS Group or ELKO EP, s.r.o.
> I'm just user of their devices who wants to have smooth UX on Apple devices.
