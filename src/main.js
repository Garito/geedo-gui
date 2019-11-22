import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/styles.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLock, faUpload, faHome, faCheck, faTimes, faMoneyBill, faStar, faPlus, faLink, faCaretLeft, faInfo, faHistory, faUsers, faSearch, faShieldAlt, faUserShield, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope, faEye, faEyeSlash, faUserCircle, faTrashAlt, faEdit, faPlusSquare, faMinusSquare, faShareSquare, faPaperPlane, faFile, faComments, faCheckCircle, faTimesCircle, faBell, faCommentAlt, faCalendarAlt } from '@fortawesome/free-regular-svg-icons'

import VueFileAgent from 'vue-file-agent'
import 'vue-file-agent/dist/vue-file-agent.css'

import VueNativeSock from 'vue-native-websocket'

import yRestPlugin, { Form, FormInput, FormTextarea, FormCheckbox, FormRadio, FormObject } from '@/yrest'
import FormSelect from '@/components/formselect'
import FormFile from '@/components/formfile'
import FormGeoAddress from '@/components/formgeoaddress'

import i18n from './i18n'

library.add(faLock, faUpload, faHome, faCheck, faTimes, faMoneyBill, faStar, faPlus, faLink, faCaretLeft, faInfo, faHistory, faUsers, faSearch, faShieldAlt, faUserShield, faToggleOn, faToggleOff, faEnvelope, faEye, faEyeSlash, faUserCircle, faTrashAlt, faEdit, faPlusSquare, faMinusSquare, faShareSquare, faPaperPlane, faFile, faComments, faCheckCircle, faTimesCircle, faBell, faCommentAlt, faCalendarAlt)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

Vue.use(VueFileAgent)

const wsUrl = process.env.VUE_APP_WEBSOCKET_URL.startsWith('ws://') ? process.env.VUE_APP_WEBSOCKET_URL : 'ws://' + location.host + process.env.VUE_APP_WEBSOCKET_URL
Vue.use(VueNativeSock, wsUrl, { connectManually: true })

Vue.use(yRestPlugin)

Vue.component('Form', Form)
Vue.component('FormInput', FormInput)
Vue.component('FormTextarea', FormTextarea)
Vue.component('FormSelect', FormSelect)
Vue.component('FormCheckbox', FormCheckbox)
Vue.component('FormRadio', FormRadio)
Vue.component('FormFile', FormFile)
Vue.component('FormObject', FormObject)
Vue.component('FormGeoAddress', FormGeoAddress)

const isProd = process.env.NODE_ENV === 'production'

Vue.config.productionTip = !isProd

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
