import store from './store'
import { getViews, beforeEach } from './router'

import Plugin from './plugin'

import DynamicLayout from './components/dynamiclayout'

import Tree from './components/Tree/tree'
import Node from './components/Tree/node'

import Form from './components/Form/form'
import FormInput from './components/Form/input'
import FormTextarea from './components/Form/textarea'
import FormSelect from './components/Form/select'
import FormCheckbox from './components/Form/checkbox'
import FormRadio from './components/Form/radio'
import FormFile from './components/Form/file'
import FormObject from './components/Form/object'

export default Plugin

export { store, getViews, beforeEach, DynamicLayout, Tree, Node, Form, FormInput, FormTextarea, FormSelect, FormCheckbox, FormRadio, FormFile, FormObject }
