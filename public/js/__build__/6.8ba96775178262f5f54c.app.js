webpackJsonp([6],{39:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o,s,u,c,d,p,f,m,_,y,v,b,h,g,E,N,w,T,O,M=function(){function e(e,t){var n,a;for(n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();Object.defineProperty(t,"__esModule",{value:!0}),o=n(1),s=a(o),u=n(16),c=a(u),d=n(76),p=a(d),f=s.default.createElement("div",{className:"mdl-spinner__circle"}),m=s.default.createElement("div",{className:"mdl-spinner__circle"}),_=s.default.createElement("div",{className:"mdl-spinner__circle"}),y=s.default.createElement("div",{className:"mdl-spinner__circle"}),v=s.default.createElement("div",{className:"mdl-spinner__circle"}),b=s.default.createElement("div",{className:"mdl-spinner__circle"}),h=s.default.createElement("div",{className:"mdl-spinner__circle"}),g=s.default.createElement("div",{className:"mdl-spinner__circle"}),E=s.default.createElement("div",{className:"mdl-spinner__circle"}),N=s.default.createElement("div",{className:"mdl-spinner__circle"}),w=s.default.createElement("div",{className:"mdl-spinner__circle"}),T=s.default.createElement("div",{className:"mdl-spinner__circle"}),O=function(e){function t(){return r(this,t),l(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),M(t,[{key:"render",value:function(){return s.default.createElement("div",{styleName:"loading-spinner",className:"loading-spinner"},s.default.createElement("div",{className:"mdl-spinner mdl-js-spinner is-active is-upgraded","data-upgraded":",MaterialSpinner"},s.default.createElement("div",{className:"mdl-spinner__layer mdl-spinner__layer-1"},s.default.createElement("div",{className:"mdl-spinner__circle-clipper mdl-spinner__left"},f),s.default.createElement("div",{className:"mdl-spinner__gap-patch"},m),s.default.createElement("div",{className:"mdl-spinner__circle-clipper mdl-spinner__right"},_)),s.default.createElement("div",{className:"mdl-spinner__layer mdl-spinner__layer-2"},s.default.createElement("div",{className:"mdl-spinner__circle-clipper mdl-spinner__left"},y),s.default.createElement("div",{className:"mdl-spinner__gap-patch"},v),s.default.createElement("div",{className:"mdl-spinner__circle-clipper mdl-spinner__right"},b)),s.default.createElement("div",{className:"mdl-spinner__layer mdl-spinner__layer-3"},s.default.createElement("div",{className:"mdl-spinner__circle-clipper mdl-spinner__left"},h),s.default.createElement("div",{className:"mdl-spinner__gap-patch"},g),s.default.createElement("div",{className:"mdl-spinner__circle-clipper mdl-spinner__right"},E)),s.default.createElement("div",{className:"mdl-spinner__layer mdl-spinner__layer-4"},s.default.createElement("div",{className:"mdl-spinner__circle-clipper mdl-spinner__left"},N),s.default.createElement("div",{className:"mdl-spinner__gap-patch"},w),s.default.createElement("div",{className:"mdl-spinner__circle-clipper mdl-spinner__right"},T))))}}]),t}(o.Component),t.default=(0,c.default)(O,p.default,{allowMultiple:!0})},43:function(e,t,n){(function(e,a){function r(e,t){this._id=e,this._clearFn=t}var l=n(111).nextTick,i=Function.prototype.apply,o=Array.prototype.slice,s={},u=0;t.setTimeout=function(){return new r(i.call(setTimeout,window,arguments),clearTimeout)},t.setInterval=function(){return new r(i.call(setInterval,window,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(window,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},t.setImmediate="function"==typeof e?e:function(e){var n=u++,a=arguments.length<2?!1:o.call(arguments,1);return s[n]=!0,l(function(){s[n]&&(a?e.apply(null,a):e.call(null),t.clearImmediate(n))}),n},t.clearImmediate="function"==typeof a?a:function(e){delete s[e]}}).call(t,n(43).setImmediate,n(43).clearImmediate)},61:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o,s,u,c,d,p,f,m,_,y,v,b,h,g,E,N,w,T,O,M,C=function(){function e(e,t){var n,a,r=[],l=!0,i=!1,o=void 0;try{for(n=e[Symbol.iterator]();!(l=(a=n.next()).done)&&(r.push(a.value),!t||r.length!==t);l=!0);}catch(s){i=!0,o=s}finally{try{!l&&n.return&&n.return()}finally{if(i)throw o}}return r}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),P=Object.assign||function(e){var t,n,a;for(t=1;t<arguments.length;t++){n=arguments[t];for(a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},j=function(){function e(e,t){var n,a;for(n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();Object.defineProperty(t,"__esModule",{value:!0}),t.Select=t.Text=void 0,f=n(1),m=a(f),_=n(16),y=a(_),v=n(109),b=a(v),h=n(55),g=a(h),E=n(48),N=a(E),w=n(15),T=(0,w.defineMessages)({MONTHLY:{id:"MONTHLY",defaultMessage:"MONTHLY"},TRIMESTERLY:{id:"TRIMESTERLY",defaultMessage:"TRIMESTERLY"}}),O=t.Text=(o=(0,y.default)(b.default,{allowMultiple:!0}),o(s=function(e){function t(){return r(this,t),l(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),j(t,[{key:"render",value:function(){var e=this.props,t=e.name,n=e.description,a=e.placeholder,r=e.autoFocus,l=e.props;return m.default.createElement("div",{styleName:"field"},m.default.createElement("div",{styleName:"left",style:{width:"50%"}},m.default.createElement("div",{styleName:"label centered",style:{padding:"0 24px"}},m.default.createElement("div",{styleName:"text"},t),!n||l.error&&l.touched&&!l.pristine?null:m.default.createElement("div",{styleName:"description"},n),l.error&&l.touched&&!l.pristine&&m.default.createElement("div",{className:"text-danger"},l.error))),m.default.createElement("div",{styleName:"right",style:{marginLeft:"50%"}},m.default.createElement("input",P({className:l.error&&l.touched&&!l.pristine?"text-danger":"",autoFocus:r},l,{type:"text",styleName:"text_input",style:{height:"80px"},placeholder:a}))))}}]),t}(f.Component))||s),M=t.Select=(u=(0,y.default)(b.default,{allowMultiple:!0}),u((p=d=function(e){function t(){var e,n,a,i,o,s,u;for(r(this,t),o=arguments.length,s=Array(o),u=0;o>u;u++)s[u]=arguments[u];return n=a=l(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),a.state={open:!1},a._toggle=function(){a.setState({open:!a.state.open})},a._hide=function(e){a.refs.dropdown&&!a.refs.dropdown.contains(e.target)&&a.setState({open:!1})},a.dropdownClickHandler=function(e){e.nativeEvent.stopImmediatePropagation()},i=n,l(a,i)}return i(t,e),j(t,[{key:"componentWillReceiveProps",value:function(){}},{key:"componentDidMount",value:function(){g.default.on(document,"click",this._hide,!0)}},{key:"componentWillUnmount",value:function(){g.default.off(document,"click",this._hide,!0)}},{key:"render",value:function(){var e=this,t=this.context.intl.formatMessage,n=this.props,a=n.name,r=n.description,l=n.values,i=n.props,o=function(t,n){t.nativeEvent.stopImmediatePropagation(),i.onChange(n),e._toggle()},s=function(){return e.state.open?m.default.createElement("div",{style:{overflow:"hidden",transition:"all .5s cubic-bezier(1,0,0,1)"}},m.default.createElement("div",{ref:"dropdown",className:(0,N.default)({"clearfix select-dropdown":!0,open:e.state.open}),onClick:e.dropdownClickHandler},m.default.createElement("div",{className:"dropdown-menu "+e.props.styles.menu},l.map(function(t){var n=C(t,2),a=n[0],r=n[1];return m.default.createElement("a",{key:a,onClick:function(e){return o(e,a)},className:""},m.default.createElement("div",{className:e.props.styles.option},r))})))):m.default.createElement("div",{className:e.props.styles.dropdown,onClick:e._toggle},m.default.createElement("div",{className:e.props.styles.current},m.default.createElement("div",{className:e.props.styles.option},t(T[i.value||i.defaultValue]))))};return m.default.createElement("div",{styleName:"field"},m.default.createElement("div",{styleName:"left",style:{width:"50%"}},m.default.createElement("div",{styleName:"label centered",style:{padding:"0 24px"}},m.default.createElement("div",{styleName:"text"},a),!r||i.error&&i.touched&&!i.pristine?null:m.default.createElement("div",{styleName:"description"},r),i.error&&i.touched&&!i.pristine&&m.default.createElement("div",{className:"text-danger"},i.error))),m.default.createElement("div",{styleName:"right",style:{marginLeft:"50%"}},s()))}}]),t}(f.Component),d.contextTypes={intl:w.intlShape.isRequired},c=p))||c)},62:function(e,t,n){"use strict";function a(e){return f(e)||/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e)?void 0:p.email}function r(e){return f(e)?p.required:void 0}function l(e){return function(t){return!f(t)&&t.length<e?"Must be at least "+e+" characters":void 0}}function i(e){return function(t){return!f(t)&&t.length>e?"Must be no more than "+e+" characters":void 0}}function o(e){return Number.isInteger(Number(e))?void 0:"Must be an integer"}function s(e){return function(t){return~e.indexOf(t)?void 0:"Must be one of: "+e.join(", ")}}function u(e){return function(t,n){return n&&t!==n[e]?"Do not match":void 0}}function c(e){return function(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n={};return Object.keys(e).forEach(function(a){var r=m([].concat(e[a])),l=r(t[a],t);l&&(n[a]=l)}),n}}var d,p,f,m;Object.defineProperty(t,"__esModule",{value:!0}),t.email=a,t.required=r,t.minLength=l,t.maxLength=i,t.integer=o,t.oneOf=s,t.match=u,t.createValidator=c,d=n(15),p=(0,d.defineMessages)({required:{id:"error.required",defaultMessage:"Required"},email:{id:"error.invalid-email",defaultMessage:"Invalid email address"}}),f=function(e){return void 0===e||null===e||""===e},m=function(e){return function(t,n){return e.map(function(e){return e(t,n)}).filter(function(e){return!!e})[0]}}},76:function(e,t){e.exports={"loading-spinner":"Loading__loading-spinner___3NOF4"}},105:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}var r,l;Object.defineProperty(t,"__esModule",{value:!0}),r=n(1),l=a(r),t.default=function(e){var t=e.viewer,n=e.onClick,a=e.styles;return l.default.createElement("div",{className:a.header},l.default.createElement("a",{className:a.logo,onClick:n.bind(void 0,"/apps")},l.default.createElement("i",{className:"material-icons md-light"},"account_balance_wallet"),"Compta"),l.default.createElement("div",{className:a.account},l.default.createElement("a",{className:"",onClick:n.bind(void 0,"/account")},t.email)))}},108:function(e,t){e.exports={sidebar:"Sidebar__sidebar___EiywH",header:"Sidebar__header___h2pxt",logo:"Sidebar__logo___1Y7Wu",account:"Sidebar__account___2OHfI",content:"Sidebar__content___1hU5l",createApp:"Sidebar__createApp____1cQY",section:"Sidebar__section___1bm9n",section_header:"Sidebar__section_header___2yu2Z",active:"Sidebar__active___CLk3G",apps:"Sidebar__apps___36cT9",currentApp:"Sidebar__currentApp___PVq0o",menuRow:"Sidebar__menuRow___3_xNK",fonts_loaded:"Sidebar__fonts_loaded___qabIc",badge:"Sidebar__badge___1RpuZ",appsMenu:"Sidebar__appsMenu___vR_qu",unselectable:"Sidebar__unselectable___2LQSe",menuSection:"Sidebar__menuSection___30ErY",sections:"Sidebar__sections___dDdUV",action:"Sidebar__action___2WUur"}},109:function(e,t){e.exports={field:"form__field___1M-UF",left:"form__left___1fwdh",right:"form__right___3FnKu",label:"form__label___1hb_i",centered:"form__centered___2LIZU",text:"form__text___13q_g",description:"form__description___wjUtA",fonts_loaded:"form__fonts_loaded___2qmhx",text_input:"form__text_input___16Dtu",dropdown:"form__dropdown___38tqT",menu:"form__menu___ig0bK",current:"form__current___2N9Be",option:"form__option___3LNSJ",placeHolder:"form__placeHolder___3cIJZ",hideArrow:"form__hideArrow___xzm8n"}},120:function(e,t,n){(function(e){"use strict";function a(e){var t,n;if(e&&e.__esModule)return e;if(t={},null!=e)for(n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function r(e){return e&&e.__esModule?e:{"default":e}}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e){if(null==e)throw new TypeError("Cannot destructure undefined")}function u(e){var t=e.displayName;return t?new Promise(function(e,n){var a=new x.default.Query(A.Company);a.equalTo("displayNameLowerCase",t.toLowerCase()),a.first().then(function(t){return t?void n({displayName:I.displayNameError}):void e()},function(){n({displayName:I.error})})}):Promise.resolve({})}var c,d,p,f,m,_,y,v,b,h,g,E,N,w,T,O,M,C,P,j,k,S,x,R,A,q,F,I,L,Y,H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},D=Object.assign||function(e){var t,n,a;for(t=1;t<arguments.length;t++){n=arguments[t];for(a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},Q=function(){function e(e,t){var n,a;for(n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,_=n(1),y=r(_),v=n(69),b=n(104),h=n(121),g=r(h),E=n(106),N=a(E),w=n(48),T=r(w),O=n(112),M=r(O),C=n(129),P=r(C),j=n(16),k=r(j),S=n(36),x=r(S),R=n(61),A=n(124),q=n(15),F=function(e){return s(e),y.default.createElement("div",{className:"mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded"},y.default.createElement("div",{className:"progressbar bar bar1",style:{width:"0%"}}),y.default.createElement("div",{className:"bufferbar bar bar2",style:{width:"100%"}}),y.default.createElement("div",{className:"auxbar bar bar3",style:{width:"0%"}}))},I=(0,q.defineMessages)({error:{id:"error.unknown",defaultMessage:"There was an unknown error. Please try again."},displayNameError:{id:"error.displayName",defaultMessage:"This Company Name was already used"},formTitle:{id:"message.add-company-title",defaultMessage:"Create a new company"},formSubtitle:{id:"message.add-company-subtitle",defaultMessage:"Just give it a name first…"},displayNameLabel:{id:"label.displayName",defaultMessage:"What should we call it?"},displayNameDesc:{id:"description.displayName",defaultMessage:"This is how we’ll reference it. Don’t use any special characters, and start your name with a letter."},displayNamePlaceholder:{id:"placeholder.displayName",defaultMessage:"Pick a good name…"},periodTypeLabel:{id:"label.periodType",defaultMessage:"What type of Period do you need?"},MONTHLY:{id:"MONTHLY",defaultMessage:"MONTHLY"},TRIMESTERLY:{id:"TRIMESTERLY",defaultMessage:"TRIMESTERLY"},cancel:{id:"cancel",defaultMessage:"Cancel"},save:{id:"action.save-company",defaultMessage:"Create it!"},saving:{id:"action.saving-company",defaultMessage:"Saving…"}}),L=y.default.createElement(F,null),c=(0,b.reduxForm)({form:"company",fields:["id","displayName","periodType"],validate:g.default,asyncValidate:u,asyncBlurFields:["displayName"]},function(e,t){return{saveError:e.companies.saveError,initialValues:t.company||{periodType:"MONTHLY"}}},function(e){return(0,v.bindActionCreators)(N,e)}),d=(0,k.default)(P.default,{}),Y=c(p=d((m=f=function(t){function n(){return l(this,n),i(this,Object.getPrototypeOf(n).apply(this,arguments))}return o(n,t),Q(n,[{key:"render",value:function(){var t=this,n=this.context.intl.formatMessage,a=this.props,r=(a.asyncValidating,a.dirty,a.formKey),l=a.editStop,i=a.fields,o=(i.id,i.displayName),s=i.periodType,u=a.handleSubmit,c=a.valid,d=a.invalid,p=a.pristine,f=a.save,m=a.submitting,_=a.saveError[r],v=(a.values,a.onCancel),b=function(){l(r),v()};return y.default.createElement(M.default,{styleName:"modal",className:(0,T.default)({valid:!p&&c,submitting:m,form:!0}),show:!0,keyboard:!1,backdrop:"static",onHide:function(){return b()},autoFocus:!0,enforceFocus:!0},y.default.createElement(M.default.Header,null,y.default.createElement("div",{className:"title"},n(I.formTitle)),y.default.createElement("div",{className:"subtitle"},n(I.formSubtitle))),y.default.createElement(M.default.Body,null,y.default.createElement(R.Select,{name:n(I.periodTypeLabel),values:h.periodTypes.map(function(e){return[e,n(I[e])]}),props:s}),y.default.createElement(R.Text,{name:n(I.displayNameLabel),description:n(I.displayNameDesc),placeholder:n(I.displayNamePlaceholder),autoFocus:!0,props:D({},o,{error:o.error&&n(o.error)})}),_&&y.default.createElement("div",{styleName:"error"},n(_)),m&&L),y.default.createElement(M.default.Footer,null,y.default.createElement("button",{styleName:"button",onClick:function(){return b()},disabled:m,className:"btn btn-primary-outline unselectable"},n(I.cancel)),y.default.createElement("button",{styleName:"button",onClick:u(function(n){return f(D({},n,{viewer:t.props.viewer,root:t.props.root})).then(function(n){return n&&"object"===H(n.error)?Promise.reject(I.error):(b(),void e(function(){t.context.router.push("/apps/"+n.result.id+"/")}))})}),disabled:p||d||m,className:"btn btn-primary unselectable"+(!p&&c?" green":"")}," ",n(m?I.saving:I.save))))}}]),n}(_.Component),f.contextTypes={intl:q.intlShape.isRequired,router:_.PropTypes.object.isRequired},f.propTypes={fields:_.PropTypes.object.isRequired,asyncValidating:_.PropTypes.oneOfType([_.PropTypes.bool,_.PropTypes.string]).isRequired,dirty:_.PropTypes.bool.isRequired,handleSubmit:_.PropTypes.func.isRequired,valid:_.PropTypes.bool.isRequired,invalid:_.PropTypes.bool.isRequired,pristine:_.PropTypes.bool.isRequired,save:_.PropTypes.func.isRequired,submitting:_.PropTypes.bool.isRequired,saveError:_.PropTypes.object,formKey:_.PropTypes.string.isRequired,values:_.PropTypes.object.isRequired},p=m))||p)||p,t.default=Y}).call(t,n(43).setImmediate)},121:function(e,t,n){"use strict";var a,r,l;Object.defineProperty(t,"__esModule",{value:!0}),t.periodTypes=void 0,a=n(62),r=t.periodTypes=["MONTHLY","TRIMESTERLY"],l=(0,a.createValidator)({displayName:[a.required],periodType:[a.required,(0,a.oneOf)(r)]}),t.default=l},123:function(e,t){"use strict";var n,a;Object.defineProperty(t,"__esModule",{value:!0}),n=t.sortMostRecent=function(e){return function(t,n){return e(n)-e(t)}},a=t.sortOldest=function(e){return function(t,n){return e(t)-e(n)}}},124:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}var r,l,i;Object.defineProperty(t,"__esModule",{value:!0}),t.Company=void 0,r=n(36),l=a(r),i=t.Company=l.default.Object.extend("Company")},129:function(e,t){e.exports={button:"CompanyForm__button___3fi-1","btn-primary":"CompanyForm__btn-primary___1GGt0",error:"CompanyForm__error___qqi-4",modal:"CompanyForm__modal___1QvP2"}},391:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o,s,u,c,d,p,f,m,_,y,v,b,h,g,E,N,w,T=function(){function e(e,t){var n,a;for(n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();Object.defineProperty(t,"__esModule",{value:!0}),d=n(1),p=a(d),f=n(16),m=a(f),_=n(108),y=a(_),v=n(105),b=a(v),h=n(15),g=(0,h.defineMessages)({"/apps":{id:"apps-menu-item-title",defaultMessage:"Your Companies"},"/account":{id:"account-settings-menu-item-title",defaultMessage:"Account AccountSettings"}}),E=[{page:"/apps",icon:"inbox"},{page:"/account",icon:"supervisor_account"}],o=(0,m.default)(y.default,{allowMultiple:!0}),N=o(s=function(e){function t(){return r(this,t),l(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),T(t,[{key:"render",value:function(){var e=this.props,t=e.selected,n=e.page,a=e.icon,r=e.onClick;return t?p.default.createElement("div",{styleName:"section active"},p.default.createElement("div",{styleName:"section_header"},p.default.createElement("i",{className:"material-icons md-36"},a),p.default.createElement("span",null,p.default.createElement(h.FormattedMessage,g[n])))):p.default.createElement("div",{styleName:"section"},p.default.createElement("a",{styleName:"section_header",onClick:r.bind(null,n)},p.default.createElement("i",{className:"material-icons md-36"},a),p.default.createElement("span",null,p.default.createElement(h.FormattedMessage,g[n]))))}}]),t}(d.Component))||s,c=u=function(e){function t(){var e,n,a,i,o,s,u;for(r(this,t),o=arguments.length,s=Array(o),u=0;o>u;u++)s[u]=arguments[u];return n=a=l(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),a._onClick=function(e,t){t.preventDefault(),a.context.router.push(e)},i=n,l(a,i)}return i(t,e),T(t,[{key:"render",value:function(){var e=this;return p.default.createElement("div",null,p.default.createElement("div",{styleName:"sidebar"},p.default.createElement(b.default,{viewer:this.props.viewer,styles:this.props.styles,onClick:this._onClick}),p.default.createElement("div",{styleName:"content"},E.map(function(t){var n=t.page,a=t.icon,r=t.title;return p.default.createElement(N,{key:n,page:n,icon:a,title:r,selected:e.props.page===n,onClick:e._onClick})}))))}}]),t}(d.Component),u.contextTypes={router:d.PropTypes.object},w=c,t.default=(0,m.default)(w,y.default,{allowMultiple:!0})},906:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function o(e,t){var n=function(n){function a(){return r(this,a),l(this,Object.getPrototypeOf(a).apply(this,arguments))}return i(a,n),h(a,[{key:"render",value:function(){return E.default.createElement(e,b({},t,{companies:this.props.root.companies},t,{root:this.props.root}),this.props.children)}}]),a}(E.default.Component);return w.default.createContainer(n,{initialVariables:{},fragments:{root:function(){return function(){return{children:[{fieldName:"id",kind:"Field",metadata:{isRequisite:!0},type:"String"},{children:[{fieldName:"id",kind:"Field",metadata:{isRequisite:!0},type:"ID"},{fieldName:"displayName",kind:"Field",metadata:{},type:"String"},{fieldName:"periodType",kind:"Field",metadata:{},type:"PeriodType"},{fieldName:"lastSeqNr",kind:"Field",metadata:{},type:"Int"},{fieldName:"createdAt",kind:"Field",metadata:{},type:"String"},{fieldName:"updatedAt",kind:"Field",metadata:{},type:"String"}],fieldName:"companies",kind:"Field",metadata:{inferredRootCallName:"node",inferredPrimaryKey:"id",isPlural:!0},type:"Company"}],kind:"Fragment",metadata:{},name:"Apps",type:"Query"}}()}}})}var s,u,c,d,p,f,m,_,y,v,b=Object.assign||function(e){var t,n,a;for(t=1;t<arguments.length;t++){n=arguments[t];for(a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},h=function(){function e(e,t){var n,a;for(n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),g=n(1),E=a(g),N=n(27),w=a(N),T=n(391),O=a(T),M=n(39),C=a(M),P=n(16),j=a(P),k=n(1146),S=a(k),x=n(924),R=a(x),A=n(120),q=a(A),F=n(106),I=n(123),L=n(15),Y=(0,L.defineMessages)({newApp:{id:"action.create-new-app",defaultMessage:"Create a new app"},created:{id:"message.created",defaultMessage:"Created"},filter:{id:"message.filter-companies",defaultMessage:"Start typing to filter…"},noData:{id:"message.no-data",defaultMessage:"No data to display."}}),H=function(e){var t=e.styles,n=e.message;return E.default.createElement("div",{className:t.empty,style:{top:"88px",background:"#fdfafb"}},E.default.createElement("div",{className:t.center},E.default.createElement("div",{className:t.icon},E.default.createElement("i",{style:{color:"#343445",width:"80",height:"80",fontSize:"80px"},className:"material-icons md-light"},"perm_media")),E.default.createElement("div",{className:t.title},n)))},D=(u=s=function(e){function t(){return r(this,t),l(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),h(t,[{key:"render",value:function(){var e=this.context.intl.formatMessage;return E.default.createElement("div",{className:"header"},E.default.createElement("i",{className:"material-icons",style:{color:"#788c97",transform:"rotate(90deg)"}},"search"),E.default.createElement("input",{onChange:this.props.onFilterChange,className:"search",placeholder:e(Y.filter),value:this.props.filterQuery}),E.default.createElement("a",{onClick:this.props.onAddClicked,role:"button",className:"create"},E.default.createElement(L.FormattedMessage,Y.newApp)))}}]),t}(g.Component),s.contextTypes={intl:L.intlShape.isRequired},u),Q=(c=(0,j.default)(S.default,{}),c((f=p=function(e){function t(){var e,n,a,i,o,s,u;for(r(this,t),o=arguments.length,s=Array(o),u=0;o>u;u++)s[u]=arguments[u];return n=a=l(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),a._onClick=function(e){e.preventDefault(),e.stopPropagation(),a.context.router.push({pathname:"/apps/"+a.props.company.id+"/",state:{}})},i=n,l(a,i)}return i(t,e),h(t,[{key:"render",value:function(){return E.default.createElement("li",{onClick:this._onClick,style:{}},E.default.createElement("a",{className:"icon"},E.default.createElement("i",{className:"material-icons md-48 md-dark md-inactive"},"inbox")),E.default.createElement("div",{styleName:"plan"},E.default.createElement("div",{styleName:"section"},"Current plan"),E.default.createElement("div",{styleName:"count"},E.default.createElement("div",{styleName:"number"},"30"),E.default.createElement("div",{styleName:"label"},"requests/s")),E.default.createElement("div",{styleName:"count"},E.default.createElement("div",{styleName:"number"},"1"),E.default.createElement("div",{styleName:"label"},"background job")),E.default.createElement("div",{styleName:"count"},E.default.createElement("div",{styleName:"number"},"$0"),E.default.createElement("div",{styleName:"label"},"monthly"))),E.default.createElement("div",{styleName:"glance"},E.default.createElement("div",{styleName:"section"},"At a glance"),E.default.createElement("div",{styleName:"count"},E.default.createElement("div",{styleName:"number"},"0"),E.default.createElement("div",{styleName:"label"},"requests")),E.default.createElement("div",{styleName:"count"},E.default.createElement("div",{styleName:"number"},"0"),E.default.createElement("div",{styleName:"label"},"total users")),E.default.createElement("div",{styleName:"count"},E.default.createElement("div",{styleName:"number"},"0"),E.default.createElement("div",{styleName:"label"},"total installations"))),E.default.createElement("div",{className:"details"},E.default.createElement("a",{className:"appname"},this.props.company.displayName),E.default.createElement("div",null,E.default.createElement("span",null,E.default.createElement(L.FormattedMessage,Y.created))," ",E.default.createElement("span",{className:"ago"},E.default.createElement(L.FormattedRelative,{value:this.props.company.createdAt})))))}}]),t}(g.Component),p.contextTypes={router:g.PropTypes.object.isRequired},d=f))||d),V=(m=(0,j.default)(S.default,{}),m((v=y=function(e){function t(){var e,n,a,i,o,s,u;for(r(this,t),o=arguments.length,s=Array(o),u=0;o>u;u++)s[u]=arguments[u];return n=a=l(this,(e=Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),a.state={modalOpen:!1},a._onAddClicked=function(e){e.preventDefault(),a.context.store.dispatch((0,F.editStart)("NEW")),a.setState({modalOpen:!0})},a._close=function(){a.setState({modalOpen:!1})},a._renderForm=function(){var e=a.state.modalOpen?E.default.createElement(q.default,{onCancel:a._close,formKey:"NEW",root:a.props.root,viewer:a.props.viewer}):null;return e},a._onFilterChange=function(e){a.setState({filterQuery:e.target.value})},i=n,l(a,i)}return i(t,e),h(t,[{key:"render",value:function(){var e=this.context.intl.formatMessage,t=(this.state.filterQuery||"").trim(),n=void 0;return Boolean(t)?!function(){var e=new RegExp("^"+(t||"").trim(),"i");n=function(t){return e.test(t.displayName)}}():n=function(){return!0},this.props.companies.sort((0,I.sortMostRecent)(function(e){return Date.parse(e.createdAt)})),E.default.createElement("div",{className:""},E.default.createElement(O.default,{viewer:this.props.viewer,page:"/apps"}),E.default.createElement("div",{className:"content"},E.default.createElement("div",{className:"index"},E.default.createElement(D,{filterQuery:this.state.filterQuery,onAddClicked:this._onAddClicked,onFilterChange:this._onFilterChange}),0===this.props.companies.length?E.default.createElement(H,{message:e(Y.noData),styles:this.props.styles}):E.default.createElement("ul",{className:"apps"},this.props.companies.map(function(e){return n(e)&&E.default.createElement(Q,{key:e.id,company:e})})))),this._renderForm())}}]),t}(g.Component),y.contextTypes={store:g.PropTypes.object.isRequired,intl:L.intlShape.isRequired},_=v))||_),U=E.default.createElement(C.default,null);e.exports=function(e){return E.default.createElement(w.default.RootContainer,{Component:o(V,e),route:new R.default,renderLoading:function(){return E.default.createElement("div",{className:"loading"},E.default.createElement(O.default,{
viewer:e.viewer,page:"/apps"}),E.default.createElement("div",{className:"content"},U))}})}},924:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o,s,u,c,d;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u=n(27),c=a(u),s=o=function(e){function t(){return r(this,t),l(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(c.default.Route),o.queries={root:function(){return function(){return{fieldName:"root",kind:"Query",metadata:{},name:"AppsHomeRoute",type:"Query"}}()}},o.paramDefinitions={},o.routeName="AppsHomeRoute",d=s,t.default=d},1146:function(e,t){e.exports={table:"Apps__table___1hqry",empty:"Apps__empty___J9BVU",center:"Apps__center___37lJ4",icon:"Apps__icon___NCwCY",title:"Apps__title___s0wbW",fonts_loaded:"Apps__fonts_loaded___2VzA4",description:"Apps__description___1lRw_",glance:"Apps__glance___3kwr_",section:"Apps__section___BGx0q",count:"Apps__count___2w9A3",number:"Apps__number___3aVNr",label:"Apps__label___3os42",edit:"Apps__edit___3umGU",plan:"Apps__plan___2QC1Z"}}});
//# sourceMappingURL=6.8ba96775178262f5f54c.app.js.map