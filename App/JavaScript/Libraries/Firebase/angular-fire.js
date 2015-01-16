﻿/*!
 * AngularFire is the officially supported AngularJS binding for Firebase. Firebase
 * is a full backend so you don't need servers to build your Angular app. AngularFire
 * provides you with the $firebase service which allows you to easily keep your $scope
 * variables in sync with your Firebase backend.
 *
 * AngularFire 0.9.1
 * https://github.com/firebase/angularfire/
 * Date: 01/08/2015
 * License: MIT
 */
!function(a){"use strict";angular.module("firebase",[]).value("Firebase",a.Firebase).value("firebaseBatchDelay",50)}(window),function(){"use strict";angular.module("firebase").factory("$FirebaseArray",["$log","$firebaseUtils",function(a,b){function c(a,c,d){var e=this;return this._observers=[],this.$list=[],this._inst=a,this._promise=d,this._destroyFn=c,this._indexCache={},b.getPublicMethods(e,function(a,b){e.$list[b]=a.bind(e)}),this.$list}return c.prototype={$add:function(a){return this._assertNotDestroyed("$add"),this.$inst().$push(b.toJSON(a))},$save:function(a){this._assertNotDestroyed("$save");var c=this,d=c._resolveItem(a),e=c.$keyAt(d);return null!==e?c.$inst().$set(e,b.toJSON(d)).then(function(a){return c.$$notify("child_changed",e),a}):b.reject("Invalid record; could determine its key: "+a)},$remove:function(a){this._assertNotDestroyed("$remove");var c=this.$keyAt(a);return null!==c?this.$inst().$remove(c):b.reject("Invalid record; could not find key: "+a)},$keyAt:function(a){var b=this._resolveItem(a);return this.$$getKey(b)},$indexFor:function(a){var b=this,c=b._indexCache;if(!c.hasOwnProperty(a)||b.$keyAt(c[a])!==a){var d=b.$list.findIndex(function(c){return b.$$getKey(c)===a});-1!==d&&(c[a]=d)}return c.hasOwnProperty(a)?c[a]:-1},$loaded:function(a,b){var c=this._promise;return arguments.length&&(c=c.then.call(c,a,b)),c},$inst:function(){return this._inst},$watch:function(a,b){var c=this._observers;return c.push([a,b]),function(){var d=c.findIndex(function(c){return c[0]===a&&c[1]===b});d>-1&&c.splice(d,1)}},$destroy:function(b){this._isDestroyed||(this._isDestroyed=!0,this.$list.length=0,a.debug("destroy called for FirebaseArray: "+this.$inst().$ref().toString()),this._destroyFn(b))},$getRecord:function(a){var b=this.$indexFor(a);return b>-1?this.$list[b]:null},$$added:function(a){var c=this.$indexFor(b.getKey(a));if(-1===c){var d=a.val();return angular.isObject(d)||(d={$value:d}),d.$id=b.getKey(a),d.$priority=a.getPriority(),b.applyDefaults(d,this.$$defaults),d}return!1},$$removed:function(a){return this.$indexFor(b.getKey(a))>-1},$$updated:function(a){var c=!1,d=this.$getRecord(b.getKey(a));return angular.isObject(d)&&(c=b.updateRec(d,a),b.applyDefaults(d,this.$$defaults)),c},$$moved:function(a){var c=this.$getRecord(b.getKey(a));return angular.isObject(c)?(c.$priority=a.getPriority(),!0):!1},$$error:function(b){a.error(b),this.$destroy(b)},$$getKey:function(a){return angular.isObject(a)?a.$id:null},$$process:function(a,b,c){var d,e=this.$$getKey(b),f=!1;switch(a){case"child_added":d=this.$indexFor(e);break;case"child_moved":d=this.$indexFor(e),this._spliceOut(e);break;case"child_removed":f=null!==this._spliceOut(e);break;case"child_changed":f=!0;break;default:throw new Error("Invalid event type: "+a)}return angular.isDefined(d)&&(f=this._addAfter(b,c)!==d),f&&this.$$notify(a,e,c),f},$$notify:function(a,b,c){var d={event:a,key:b};angular.isDefined(c)&&(d.prevChild=c),angular.forEach(this._observers,function(a){a[0].call(a[1],d)})},_addAfter:function(a,b){var c;return null===b?c=0:(c=this.$indexFor(b)+1,0===c&&(c=this.$list.length)),this.$list.splice(c,0,a),this._indexCache[this.$$getKey(a)]=c,c},_spliceOut:function(a){var b=this.$indexFor(a);return b>-1?(delete this._indexCache[a],this.$list.splice(b,1)[0]):null},_resolveItem:function(a){var b=this.$list;if(angular.isNumber(a)&&a>=0&&b.length>=a)return b[a];if(angular.isObject(a)){var c=this.$$getKey(a),d=this.$getRecord(c);return d===a?d:null}return null},_assertNotDestroyed:function(a){if(this._isDestroyed)throw new Error("Cannot call "+a+" method on a destroyed $FirebaseArray object")}},c.$extendFactory=function(a,d){return 1===arguments.length&&angular.isObject(a)&&(d=a,a=function(){return c.apply(this,arguments)}),b.inherit(a,c,d)},c}])}(),function(){"use strict";var a;angular.module("firebase").factory("$firebaseAuth",["$q","$firebaseUtils","$log",function(b,c,d){return function(e){var f=new a(b,c,d,e);return f.construct()}}]),a=function(a,b,c,d){if(this._q=a,this._utils=b,this._log=c,"string"==typeof d)throw new Error("Please provide a Firebase reference instead of a URL when creating a `$firebaseAuth` object.");this._ref=d},a.prototype={construct:function(){return this._object={$authWithCustomToken:this.authWithCustomToken.bind(this),$authAnonymously:this.authAnonymously.bind(this),$authWithPassword:this.authWithPassword.bind(this),$authWithOAuthPopup:this.authWithOAuthPopup.bind(this),$authWithOAuthRedirect:this.authWithOAuthRedirect.bind(this),$authWithOAuthToken:this.authWithOAuthToken.bind(this),$unauth:this.unauth.bind(this),$onAuth:this.onAuth.bind(this),$getAuth:this.getAuth.bind(this),$requireAuth:this.requireAuth.bind(this),$waitForAuth:this.waitForAuth.bind(this),$createUser:this.createUser.bind(this),$changePassword:this.changePassword.bind(this),$changeEmail:this.changeEmail.bind(this),$removeUser:this.removeUser.bind(this),$resetPassword:this.resetPassword.bind(this),$sendPasswordResetEmail:this.sendPasswordResetEmail.bind(this)},this._object},authWithCustomToken:function(a,b){var c=this._q.defer();try{this._ref.authWithCustomToken(a,this._utils.makeNodeResolver(c),b)}catch(d){c.reject(d)}return c.promise},authAnonymously:function(a){var b=this._q.defer();try{this._ref.authAnonymously(this._utils.makeNodeResolver(b),a)}catch(c){b.reject(c)}return b.promise},authWithPassword:function(a,b){var c=this._q.defer();try{this._ref.authWithPassword(a,this._utils.makeNodeResolver(c),b)}catch(d){c.reject(d)}return c.promise},authWithOAuthPopup:function(a,b){var c=this._q.defer();try{this._ref.authWithOAuthPopup(a,this._utils.makeNodeResolver(c),b)}catch(d){c.reject(d)}return c.promise},authWithOAuthRedirect:function(a,b){var c=this._q.defer();try{this._ref.authWithOAuthRedirect(a,this._utils.makeNodeResolver(c),b)}catch(d){c.reject(d)}return c.promise},authWithOAuthToken:function(a,b,c){var d=this._q.defer();try{this._ref.authWithOAuthToken(a,b,this._utils.makeNodeResolver(d),c)}catch(e){d.reject(e)}return d.promise},unauth:function(){null!==this.getAuth()&&this._ref.unauth()},onAuth:function(a,b){var c=this,d=this._utils.debounce(a,b,0);return this._ref.onAuth(d),function(){c._ref.offAuth(d)}},getAuth:function(){return this._ref.getAuth()},_routerMethodOnAuthPromise:function(a){function b(e){null!==e?d.resolve(e):a?d.reject("AUTH_REQUIRED"):d.resolve(null),c.offAuth(b)}var c=this._ref,d=this._q.defer();return c.onAuth(b),d.promise},requireAuth:function(){return this._routerMethodOnAuthPromise(!0)},waitForAuth:function(){return this._routerMethodOnAuthPromise(!1)},createUser:function(a,b){var c=this._q.defer(),d=a;"string"==typeof a&&(this._log.warn("Passing in credentials to $createUser() as individual arguments has been deprecated in favor of a single credentials argument. See the AngularFire API reference for details."),d={email:a,password:b});try{this._ref.createUser(d,this._utils.makeNodeResolver(c))}catch(e){c.reject(e)}return c.promise},changePassword:function(a,b,c){var d=this._q.defer(),e=a;"string"==typeof a&&(this._log.warn("Passing in credentials to $changePassword() as individual arguments has been deprecated in favor of a single credentials argument. See the AngularFire API reference for details."),e={email:a,oldPassword:b,newPassword:c});try{this._ref.changePassword(e,this._utils.makeNodeResolver(d))}catch(f){d.reject(f)}return d.promise},changeEmail:function(a){if("function"!=typeof this._ref.changeEmail)throw new Error("$firebaseAuth.$changeEmail() requires Firebase version 2.1.0 or greater.");var b=this._q.defer();try{this._ref.changeEmail(a,this._utils.makeNodeResolver(b))}catch(c){b.reject(c)}return b.promise},removeUser:function(a,b){var c=this._q.defer(),d=a;"string"==typeof a&&(this._log.warn("Passing in credentials to $removeUser() as individual arguments has been deprecated in favor of a single credentials argument. See the AngularFire API reference for details."),d={email:a,password:b});try{this._ref.removeUser(d,this._utils.makeNodeResolver(c))}catch(e){c.reject(e)}return c.promise},sendPasswordResetEmail:function(a){this._log.warn("$sendPasswordResetEmail() has been deprecated in favor of the equivalent $resetPassword().");try{return this.resetPassword(a)}catch(b){return this._q(function(a,c){return c(b)})}},resetPassword:function(a){var b=this._q.defer(),c=a;"string"==typeof a&&(this._log.warn("Passing in credentials to $resetPassword() as individual arguments has been deprecated in favor of a single credentials argument. See the AngularFire API reference for details."),c={email:a});try{this._ref.resetPassword(c,this._utils.makeNodeResolver(b))}catch(d){b.reject(d)}return b.promise}}}(),function(){"use strict";angular.module("firebase").factory("$FirebaseObject",["$parse","$firebaseUtils","$log","$interval",function(a,b,c){function d(a,c,d){this.$$conf={promise:d,inst:a,binding:new e(this),destroyFn:c,listeners:[]},Object.defineProperty(this,"$$conf",{value:this.$$conf}),this.$id=b.getKey(a.$ref().ref()),this.$priority=null,b.applyDefaults(this,this.$$defaults)}function e(a){this.subs=[],this.scope=null,this.key=null,this.rec=a}return d.prototype={$save:function(){var a=this;return a.$inst().$set(b.toJSON(a)).then(function(b){return a.$$notify(),b})},$remove:function(){var a=this;return b.trimKeys(this,{}),this.$value=null,a.$inst().$remove(a.$id).then(function(b){return a.$$notify(),b})},$loaded:function(a,b){var c=this.$$conf.promise;return arguments.length&&(c=c.then.call(c,a,b)),c},$inst:function(){return this.$$conf.inst},$bindTo:function(a,b){var c=this;return c.$loaded().then(function(){return c.$$conf.binding.bindTo(a,b)})},$watch:function(a,b){var c=this.$$conf.listeners;return c.push([a,b]),function(){var d=c.findIndex(function(c){return c[0]===a&&c[1]===b});d>-1&&c.splice(d,1)}},$destroy:function(a){var c=this;c.$isDestroyed||(c.$isDestroyed=!0,c.$$conf.binding.destroy(),b.each(c,function(a,b){delete c[b]}),c.$$conf.destroyFn(a))},$$updated:function(a){var c=b.updateRec(this,a);return b.applyDefaults(this,this.$$defaults),c},$$error:function(a){c.error(a),this.$destroy(a)},$$scopeUpdated:function(a){return this.$inst().$set(b.toJSON(a))},$$notify:function(){var a=this,b=this.$$conf.listeners.slice();angular.forEach(b,function(b){b[0].call(b[1],{event:"value",key:a.$id})})},forEach:function(a,c){return b.each(this,a,c)}},d.$extendFactory=function(a,c){return 1===arguments.length&&angular.isObject(a)&&(c=a,a=function(){d.apply(this,arguments)}),b.inherit(a,d,c)},e.prototype={assertNotBound:function(a){if(this.scope){var d="Cannot bind to "+a+" because this instance is already bound to "+this.key+"; one binding per instance (call unbind method or create another $firebase instance)";return c.error(d),b.reject(d)}},bindTo:function(c,d){function e(e){function f(a){var c=g(),d=b.scopeData(a);return angular.equals(c,d)&&c.$priority===a.$priority&&c.$value===a.$value}function g(){return b.scopeData(k(c))}function h(a){k.assign(c,b.scopeData(a))}function i(){var a=k(c);(a.$value!==l.$value||a.$priority!==l.$priority)&&n()}var j=!1,k=a(d),l=e.rec;e.scope=c,e.varName=d;var m=b.debounce(function(){l.$$scopeUpdated(g())["finally"](function(){j=!1})},50,500),n=function(){f(l)||(j=!0,m())},o=function(){j||f(l)||h(l)};return e.subs.push(c.$watch(i)),h(l),e.subs.push(c.$on("$destroy",e.unbind.bind(e))),e.subs.push(c.$watch(d,n,!0)),e.subs.push(l.$watch(o)),e.unbind.bind(e)}return this.assertNotBound(d)||e(this)},unbind:function(){this.scope&&(angular.forEach(this.subs,function(a){a()}),this.subs=[],this.scope=null,this.key=null)},destroy:function(){this.unbind(),this.rec=null}},d}])}(),function(){"use strict";angular.module("firebase").factory("$firebase",["$firebaseUtils","$firebaseConfig",function(a,b){function c(a,d){return this instanceof c?(this._config=b(d),this._ref=a,this._arraySync=null,this._objectSync=null,void this._assertValidConfig(a,this._config)):new c(a,d)}function d(b,c){function d(a){q.isDestroyed=!0;var c=b.$ref();c.off("child_added",k),c.off("child_moved",m),c.off("child_changed",l),c.off("child_removed",n),i=null,p(a||"destroyed")}function e(){var a=b.$ref();a.on("child_added",k,o),a.on("child_moved",m,o),a.on("child_changed",l,o),a.on("child_removed",n,o),a.once("value",function(){p(null)},p)}function f(a){h&&(a?h.reject(a):h.resolve(i),h=null)}function g(a){if(!angular.isArray(a)){var b=Object.prototype.toString.call(a);throw new Error('arrayFactory must return a valid array that passes angular.isArray and Array.isArray, but received "'+b+'"')}}var h=a.defer(),i=new c(b,d,h.promise),j=a.batch(),k=j(function(a,b){var c=i.$$added(a,b);c&&i.$$process("child_added",c,b)}),l=j(function(b){var c=i.$getRecord(a.getKey(b));if(c){var d=i.$$updated(b);d&&i.$$process("child_changed",c)}}),m=j(function(b,c){var d=i.$getRecord(a.getKey(b));if(d){var e=i.$$moved(b,c);e&&i.$$process("child_moved",d,c)}}),n=j(function(b){var c=i.$getRecord(a.getKey(b));if(c){var d=i.$$removed(b);d&&i.$$process("child_removed",c)}}),o=j(i.$$error,i),p=j(f),q=this;q.isDestroyed=!1,q.getArray=function(){return i},g(i),e()}function e(b,c){function d(a){n.isDestroyed=!0,i.off("value",k),h=null,m(a||"destroyed")}function e(){i.on("value",k,l),i.once("value",function(){m(null)},m)}function f(a){g&&(a?g.reject(a):g.resolve(h),g=null)}var g=a.defer(),h=new c(b,d,g.promise),i=b.$ref(),j=a.batch(),k=j(function(a){var b=h.$$updated(a);b&&h.$$notify()}),l=j(h.$$error,h),m=j(f),n=this;n.isDestroyed=!1,n.getObject=function(){return h},e()}return c.prototype={$ref:function(){return this._ref},$push:function(b){var c=a.defer(),d=this._ref.ref().push(),e=this._handle(c,d);return arguments.length>0?d.set(b,e):e(),c.promise},$set:function(b,c){var d=this._ref,e=a.defer();if(arguments.length>1?d=d.ref().child(b):c=b,angular.isFunction(d.set)||!angular.isObject(c))d.ref().set(c,this._handle(e,d));else{var f=angular.extend({},c);d.once("value",function(b){b.forEach(function(b){f.hasOwnProperty(a.getKey(b))||(f[a.getKey(b)]=null)}),d.ref().update(f,this._handle(e,d))},this)}return e.promise},$remove:function(b){var c=this._ref,d=this,e=a.defer();return arguments.length>0&&(c=c.ref().child(b)),angular.isFunction(c.remove)?c.remove(d._handle(e,c)):c.once("value",function(b){var f=[];b.forEach(function(b){var c=a.defer();f.push(c.promise),b.ref().remove(d._handle(c))},d),a.allPromises(f).then(function(){e.resolve(c)},function(a){e.reject(a)})}),e.promise},$update:function(b,c){var d=this._ref.ref(),e=a.defer();return arguments.length>1?d=d.child(b):c=b,d.update(c,this._handle(e,d)),e.promise},$transaction:function(b,c,d){var e=this._ref.ref();angular.isFunction(b)?(d=c,c=b):e=e.child(b),d=!!d;var f=a.defer();return e.transaction(c,function(a,b,c){a?f.reject(a):f.resolve(b?c:null)},d),f.promise},$asObject:function(){return(!this._objectSync||this._objectSync.isDestroyed)&&(this._objectSync=new e(this,this._config.objectFactory)),this._objectSync.getObject()},$asArray:function(){return(!this._arraySync||this._arraySync.isDestroyed)&&(this._arraySync=new d(this,this._config.arrayFactory)),this._arraySync.getArray()},_handle:function(a){var b=Array.prototype.slice.call(arguments,1);return function(c){c?a.reject(c):a.resolve.apply(a,b)}},_assertValidConfig:function(b,c){if(a.assertValidRef(b,"Must pass a valid Firebase reference to $firebase (not a string or URL)"),!angular.isFunction(c.arrayFactory))throw new Error("config.arrayFactory must be a valid function");if(!angular.isFunction(c.objectFactory))throw new Error("config.objectFactory must be a valid function")}},c}])}(),Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){if(void 0===this||null===this)throw new TypeError("'this' is null or not defined");var c=this.length>>>0;for(b=+b||0,1/0===Math.abs(b)&&(b=0),0>b&&(b+=c,0>b&&(b=0));c>b;b++)if(this[b]===a)return b;return-1}),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e}),Array.prototype.findIndex||Object.defineProperty(Array.prototype,"findIndex",{enumerable:!1,configurable:!0,writable:!0,value:function(a){if(null==this)throw new TypeError("Array.prototype.find called on null or undefined");if("function"!=typeof a)throw new TypeError("predicate must be a function");for(var b,c=Object(this),d=c.length>>>0,e=arguments[1],f=0;d>f;f++)if(f in c&&(b=c[f],a.call(e,b,f,c)))return f;return-1}}),"function"!=typeof Object.create&&!function(){var a=function(){};Object.create=function(b){if(arguments.length>1)throw new Error("Second argument not supported");if(null===b)throw new Error("Cannot set a null [[Prototype]]");if("object"!=typeof b)throw new TypeError("Argument must be an object");return a.prototype=b,new a}}(),Object.keys||(Object.keys=function(){"use strict";var a=Object.prototype.hasOwnProperty,b=!{toString:null}.propertyIsEnumerable("toString"),c=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],d=c.length;return function(e){if("object"!=typeof e&&("function"!=typeof e||null===e))throw new TypeError("Object.keys called on non-object");var f,g,h=[];for(f in e)a.call(e,f)&&h.push(f);if(b)for(g=0;d>g;g++)a.call(e,c[g])&&h.push(c[g]);return h}}()),"function"!=typeof Object.getPrototypeOf&&(Object.getPrototypeOf="object"==typeof"test".__proto__?function(a){return a.__proto__}:function(a){return a.constructor.prototype}),function(){"use strict";function a(b){if(!angular.isObject(b))return b;var c=angular.isArray(b)?[]:{};return angular.forEach(b,function(b,d){("string"!=typeof d||"$"!==d.charAt(0))&&(c[d]=a(b))}),c}angular.module("firebase").factory("$firebaseConfig",["$FirebaseArray","$FirebaseObject","$injector",function(a,b,c){return function(d){var e=angular.extend({},d);return"string"==typeof e.objectFactory&&(e.objectFactory=c.get(e.objectFactory)),"string"==typeof e.arrayFactory&&(e.arrayFactory=c.get(e.arrayFactory)),angular.extend({arrayFactory:a,objectFactory:b},e)}}]).factory("$firebaseUtils",["$q","$timeout","firebaseBatchDelay",function(b,c,d){var e={batch:function(a,b){function c(a,b){if("function"!=typeof a)throw new Error("Must provide a function to be batched. Got "+a);return function(){var c=Array.prototype.slice.call(arguments,0);k.push([a,b,c]),f()}}function f(){i&&(i(),i=null),h&&Date.now()-h>b?j||(j=!0,e.compile(g)):(h||(h=Date.now()),i=e.wait(g,a))}function g(){i=null,h=null,j=!1;var a=k.slice(0);k=[],angular.forEach(a,function(a){a[0].apply(a[1],a[2])})}a=d,b||(b=10*a||100);var h,i,j,k=[];return c},debounce:function(a,b,c,d){function f(){j&&(j(),j=null),i&&Date.now()-i>d?l||(l=!0,e.compile(g)):(i||(i=Date.now()),j=e.wait(g,c))}function g(){j=null,i=null,l=!1,a.apply(b,k)}function h(){k=Array.prototype.slice.call(arguments,0),f()}var i,j,k,l;if("number"==typeof b&&(d=c,c=b,b=null),"number"!=typeof c)throw new Error("Must provide a valid integer for wait. Try 0 for a default");if("function"!=typeof a)throw new Error("Must provide a valid function to debounce");return d||(d=10*c||100),h.running=function(){return i>0},h},assertValidRef:function(a,b){if(!angular.isObject(a)||"function"!=typeof a.ref||"function"!=typeof a.ref().transaction)throw new Error(b||"Invalid Firebase reference")},inherit:function(a,b,c){var d=a.prototype;return a.prototype=Object.create(b.prototype),a.prototype.constructor=a,angular.forEach(Object.keys(d),function(b){a.prototype[b]=d[b]}),angular.isObject(c)&&angular.extend(a.prototype,c),a},getPrototypeMethods:function(a,b,c){for(var d={},e=Object.getPrototypeOf({}),f=angular.isFunction(a)&&angular.isObject(a.prototype)?a.prototype:Object.getPrototypeOf(a);f&&f!==e;){for(var g in f)f.hasOwnProperty(g)&&!d.hasOwnProperty(g)&&(d[g]=!0,b.call(c,f[g],g,f));f=Object.getPrototypeOf(f)}},getPublicMethods:function(a,b,c){e.getPrototypeMethods(a,function(a,d){"function"==typeof a&&"_"!==d.charAt(0)&&b.call(c,a,d)})},defer:function(){return b.defer()},reject:function(a){var b=e.defer();return b.reject(a),b.promise},resolve:function(){var a=e.defer();return a.resolve.apply(a,arguments),a.promise},makeNodeResolver:function(a){return function(b,c){null===b?(arguments.length>2&&(c=Array.prototype.slice.call(arguments,1)),a.resolve(c)):a.reject(b)}},wait:function(a,b){var d=c(a,b||0);return function(){d&&(c.cancel(d),d=null)}},compile:function(a){return c(a||function(){})},deepCopy:function(a){if(!angular.isObject(a))return a;var b=angular.isArray(a)?a.slice():angular.extend({},a);for(var c in b)b.hasOwnProperty(c)&&angular.isObject(b[c])&&(b[c]=e.deepCopy(b[c]));return b},trimKeys:function(a,b){e.each(a,function(c,d){b.hasOwnProperty(d)||delete a[d]})},extendData:function(a,b){return e.each(b,function(b,c){a[c]=e.deepCopy(b)}),a},scopeData:function(a){var b={$id:a.$id,$priority:a.$priority};return a.hasOwnProperty("$value")&&(b.$value=a.$value),e.extendData(b,a)},updateRec:function(a,b){var c=b.val(),d=angular.extend({},a);return angular.isObject(c)?delete a.$value:(a.$value=c,c={}),e.trimKeys(a,c),angular.extend(a,c),a.$priority=b.getPriority(),!angular.equals(d,a)||d.$value!==a.$value||d.$priority!==a.$priority},applyDefaults:function(a,b){return angular.isObject(b)&&angular.forEach(b,function(b,c){a.hasOwnProperty(c)||(a[c]=b)}),a},dataKeys:function(a){var b=[];return e.each(a,function(a,c){b.push(c)}),b},each:function(a,b,c){if(angular.isObject(a)){for(var d in a)if(a.hasOwnProperty(d)){var e=d.charAt(0);"_"!==e&&"$"!==e&&"."!==e&&b.call(c,a[d],d,a)}}else if(angular.isArray(a))for(var f=0,g=a.length;g>f;f++)b.call(c,a[f],f,a);return a},getKey:function(a){return"function"==typeof a.key?a.key():a.name()},toJSON:function(b){var c;return angular.isObject(b)||(b={$value:b}),angular.isFunction(b.toJSON)?c=b.toJSON():(c={},e.each(b,function(b,d){c[d]=a(b)})),angular.isDefined(b.$value)&&0===Object.keys(c).length&&null!==b.$value&&(c[".value"]=b.$value),angular.isDefined(b.$priority)&&Object.keys(c).length>0&&null!==b.$priority&&(c[".priority"]=b.$priority),angular.forEach(c,function(a,b){if(b.match(/[.$\[\]#\/]/)&&".value"!==b&&".priority"!==b)throw new Error("Invalid key "+b+" (cannot contain .$[]#)");if(angular.isUndefined(a))throw new Error("Key "+b+" was undefined. Cannot pass undefined in JSON. Use null instead.")}),c},batchDelay:d,allPromises:b.all.bind(b)};return e}])}();