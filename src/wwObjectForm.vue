<template>
    <div class="ww-form">
        <!-- TYPE BUTTON -->
        <div v-if="wwObject.content.data.type === 'button'" class="elem-button">
            <span @click="submit()">
                <wwObject :ww-object="wwObject.content.data.button.wwObject"></wwObject>
                <span class="error-message">{{lang.getText(message)}}</span>
            </span>
        </div>
        <!-- TYPE INPUT -->
        <div class="elem-input" v-if="wwObject.content.data.type === 'input'">
            <input class="input" 
                :class="`ww-form-${wwObject.content.data.formId}`"
                :type="wwObject.content.data.input.config.type" 
                :name="wwObject.content.data.input.config.name" 
                :required="wwObject.content.data.input.config.required" 
                :pattern="wwObject.content.data.input.config.pattern" 
                :placeholder="wwObject.content.data.input.config.placeholder" 
                :style="inputStyle"/>
        </div>
        <!-- TYPE TEXTAREA -->
        <!-- <div v-if="wwObject.content.data.type === 'textarea'">
            <textarea v-model="value"/>
        </div> -->
    </div>
</template>


<script>
/* wwManager:start */
import wwFormPopupConfig from './popup/wwFormPopupConfig.vue'
import wwInputPopupStyle from './popup/input/wwInputPopupStyle.vue'
import wwInputPopupConfig from './popup/input/wwInputPopupConfig.vue'
import wwWeWebServicePopup from './popup/service/wwWeWebServicePopup.vue'

wwLib.wwPopups.addPopup('wwFormPopupConfig', wwFormPopupConfig)
wwLib.wwPopups.addPopup('wwInputPopupConfig', wwInputPopupConfig)
wwLib.wwPopups.addPopup('wwInputPopupStyle', wwInputPopupStyle)
wwLib.wwPopups.addPopup('wwWeWebServicePopup', wwWeWebServicePopup)
/* wwManager:end */

export default {
    name: "__COMPONENT_NAME__",
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data () {
        return {
            designName: wwLib.wwWebsiteData.getInfo().manifest.name,
            designId: wwLib.wwWebsiteData.getInfo().id,
            apiUrl: wwLib.wwApiRequests._getApiUrl(),
            messages: {
                error: {
                    en: `An error occured, please try later`,
                    fr: `Une erreur est survenue veuillez réessayer ultérieurement`
                },
                elementRequired (name) {
                    return {
                        en: `Element ${name} required`,
                        fr: `L'élément ${name} est requis`
                    }
                }
            },
            message: {},
            lang: wwLib.wwLang
        }
    },
    computed: {
        wwObject () {
            return this.wwObjectCtrl.get()
        },
        inputStyle() {
            let style = {};
            let wwObjectStyle = this.wwObject.content.data.input.style || {};
            if (wwObjectStyle.gradient && wwObjectStyle.gradient.value) {
                style.background = wwObjectStyle.gradient.value;
                style.backgroundColor = wwObjectStyle.gradient.default;
            } else {
                style.background = '';
                style.backgroundColor = wwObjectStyle.backgroundColor || '#FFFFFF';
            }
            style.borderRadius = (wwObjectStyle.borderRadius || 1) + 'px';
            style.borderWidth = (wwObjectStyle.borderWidth || 0) + 'px';
            style.borderColor = wwObjectStyle.borderColor || '#000000';
            style.borderStyle = wwObjectStyle.borderStyle || 'solid';
            style.boxShadow = this.getInputShadow();
            style.padding = wwObjectStyle.padding ? (wwObjectStyle.padding / 2) + 'px ' + wwObjectStyle.padding + 'px' : '0';
            return style;
        }
    },
    beforeDestroy() { },
    methods: {
        init () {
            this.wwObject.content.data = this.wwObject.content.data || {}
            // FORM
            this.wwObject.content.data.type = 'button'
            this.wwObject.content.data.formId = 5 || wwLib.wwUtils.getUniqueId()
            
            // BUTTON
            this.wwObject.content.data.button = this.wwObject.content.data.button || {}
            this.wwObject.content.data.button.config = this.wwObject.content.data.button.config || { weweb: { enabled: true, recipients: [{ address: { email: 'damien@weweb.io' } }] } } // need update data arch
            this.wwObject.content.data.button.wwObject = this.wwObject.content.data.button.wwObject || wwLib.wwObject.getDefault({ type: 'ww-button' })

            // INPUT
            this.wwObject.content.data.input = this.wwObject.content.data.input || {}
            this.wwObject.content.data.input.config = this.wwObject.content.data.input.config || {}
            this.wwObject.content.data.input.style = this.wwObject.content.data.input.style || {}
            
            this.wwObjectCtrl.update(this.wwObject)
        },
        getInputShadow() {
            let wwObjectStyle = this.wwObject.content.data.input.style || {};
            const shadow = wwObjectStyle.boxShadow || {};
            if (shadow.x || shadow.y || shadow.b || shadow.s || shadow.c) {
                return shadow.x + 'px ' + shadow.y + 'px ' + shadow.b + 'px ' + shadow.s + 'px ' + shadow.c;
            }
            return '';
        },
        // SEND FORM 
        async wewebSubmit () {
            try {
                const formInputs = document.getElementsByClassName(`ww-form-${this.wwObject.content.data.formId}`)
                const body = {
                    type: 'form',
                    from: this.designName,
                    form: [],
                    recipients: this.wwObject.content.data.button.config.weweb.recipients
                }
            
                for (const input of formInputs) {
                    const formElem = {
                        displayName: input.name,
                        value: input.value
                    }
                    if (input.required && !input.value.length) {
                        this.message = this.messages.elementRequired(input.name)
                        return
                    }
                    body.form.push(formElem)
                    // console.log('input', input.name, input.value)
                }
            
                await axios.post(`${this.apiUrl}/design/${this.designId}/send_form_info`, body)
            } catch (err) {
                this.message = this.messages.error
            }
        },
        async submit () {
            try {
                if (this.wwObject.content.data.button.config.weweb.enabled) {
                    await this.wewebSubmit()
                }
            } catch (err) {
                this.message = this.messages.error
            }
        },
        /* wwManager:start */
        async edit() {
            wwLib.wwObjectHover.setLock(this);
            wwLib.wwPopups.addStory('WWFORM_EDIT', {
                title: {
                    en: 'Edit Form',
                    fr: 'Editer le formulaire'
                },
                type: 'wwPopupEditWwObject',
                buttons: null,
                storyData: {
                    list: {
                        EDIT_CONFIG: {
                            separator: {
                                en: 'Form',
                                fr: 'Formulaire'
                            },
                            title: {
                                en: 'Form configuration',
                                fr: 'Configurer le formulaire'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-article',
                            shortcut: 'c',
                            next: 'WWFORM_CONFIG'
                        },
                        // TYPE INPUT
                        EDIT_INPUT_CONFIG: {
                            separator: {
                                en: 'Input element',
                                fr: 'Element d\'entrée'
                            },
                            title: {
                                en: 'Change input config',
                                fr: 'Changer l\'apparence de l\'élement d\'entrée'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-icon',
                            shortcut: 'c',
                            hidden: this.wwObject.content.data.type !== 'input',
                            next: 'WWINPUT_CONFIG'
                        },
                        EDIT_INPUT_STYLE: {
                            title: {
                                en: 'Change input style',
                                fr: 'Changer l\'apparence de l\'élement d\'entrée'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-edit-style',
                            shortcut: 's',
                            hidden: this.wwObject.content.data.type !== 'input',
                            next: 'WWINPUT_STYLE'
                        },
                        // TYPE BUTTON
                        EDIT_BUTTON_ACTION: {
                            separator: {
                                en: 'Button Element',
                                fr: 'Element Bouton'
                            },
                            title: {
                                en: 'Change action',
                                fr: 'Changer l\'action du formulaire'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-publish',
                            shortcut: 'a',
                            hidden: this.wwObject.content.data.type !== 'button',
                            next: 'WWFORM_ACTION'
                        },
                    }
                }
            })
            wwLib.wwPopups.addStory('WWFORM_ACTION', {
                title: {
                    en: 'Edit Form Action',
                    fr: 'Editer l\'action du formulaire'
                },
                type: 'wwPopupList',
                buttons: null,
                storyData: {
                    list: {
                        ACTION_WEWEB: {
                            title: {
                                en: 'WeWeb form email service',
                                fr: 'Service de formulaire WeWeb'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-newsletter',
                            shortcut: 'w',
                            next: 'WWSERVICE_ACTION'
                        },
                        ACTION_MAILCHIMP: {
                            title: {
                                en: 'Mailchimp service',
                                fr: 'Service de mailchimp'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'fab fa-mailchimp',
                            shortcut: 'm',
                            // next: 'WWFORM_STYLE'
                        },
                        ACTION_API: {
                            title: {
                                en: 'Custom API',
                                fr: 'Api personnalisé'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-lang',
                            shortcut: 'a',
                            // next: 'WWFORM_STYLE'
                        },
                    }
                }
            })
            // FORM POPUP
            wwLib.wwPopups.addStory('WWFORM_CONFIG', {
                title: {
                    en: 'Form configuration',
                    fr: 'Configuration du formulaire'
                },
                type: 'wwFormPopupConfig',
                buttons: {
                    OK: {
                        text: {
                            en: 'Ok',
                            fr: 'Valider'
                        },
                        next: false
                    }
                }
            })
            // INPUT POPUP
            wwLib.wwPopups.addStory('WWINPUT_CONFIG', {
                title: {
                    en: 'Input Config',
                    fr: 'Configuration de l\'entrée du formulaire'
                },
                type: 'wwInputPopupConfig',
                buttons: {
                    OK: {
                        text: {
                            en: 'Ok',
                            fr: 'Valider'
                        },
                        next: false
                    }
                }
            })
            wwLib.wwPopups.addStory('WWINPUT_STYLE', {
                title: {
                    en: 'Input style',
                    fr: 'Style de l\'entrée'
                },
                type: 'wwInputPopupStyle',
                buttons: {
                    OK: {
                        text: {
                            en: 'Ok',
                            fr: 'Valider'
                        },
                        next: false
                    }
                }
            })
            // BUTTON POPUP
            wwLib.wwPopups.addStory('WWSERVICE_ACTION', {
                title: {
                    en: 'WeWeb Service',
                    fr: 'Configuration du service de weweb'
                },
                type: 'wwWeWebServicePopup',
                buttons: {
                    OK: {
                        text: {
                            en: 'Next',
                            fr: 'Suivant'
                        },
                        next: 'LINK_INTERNAL'
                    }
                }
            })

            let options = {
                firstPage: 'WWFORM_EDIT',
                data: {
                    wwObject: this.wwObject
                }
            }
            try {
                const result = await wwLib.wwPopups.open(options);
                console.log('result', result)
                /*=============================================m_ÔÔ_m=============================================\
                  FORM CONFIGURATION
                \================================================================================================*/
                if (typeof (result.formId) != 'undefined') {
                    this.wwObject.content.data.formId = result.formId;
                }
                if (typeof (result.type) != 'undefined') {
                    this.wwObject.content.data.type = result.type;
                }
                /*=============================================m_ÔÔ_m=============================================\
                  INPUT STYLE
                \================================================================================================*/
                this.wwObject.content.data.input.style = this.wwObject.content.data.input.style || {};
                if (typeof (result.inputStyle) != 'undefined') {
                    if (typeof (result.inputStyle.borderColor) != 'undefined') {
                        this.wwObject.content.data.input.style.borderColor = result.inputStyle.borderColor;
                    }
                    if (typeof (result.inputStyle.borderRadius) != 'undefined') {
                        this.wwObject.content.data.input.style.borderRadius = result.inputStyle.borderRadius;
                    }
                    if (typeof (result.inputStyle.borderStyle) != 'undefined') {
                        this.wwObject.content.data.input.style.borderStyle = result.inputStyle.borderStyle;
                    }
                    if (typeof (result.inputStyle.borderWidth) != 'undefined') {
                        this.wwObject.content.data.input.style.borderWidth = result.inputStyle.borderWidth;
                    }
                    if (typeof (result.inputStyle.boxShadow) != 'undefined') {
                        this.wwObject.content.data.input.style.boxShadow = result.inputStyle.boxShadow;
                    }
                    if (typeof (result.inputStyle.backgroundColor) != 'undefined') {
                        this.wwObject.content.data.input.style.backgroundColor = result.inputStyle.backgroundColor;
                    }
                    if (typeof (result.inputStyle.gradient) != 'undefined') {
                        this.wwObject.content.data.input.style.gradient = result.inputStyle.gradient;
                    }
                    if (typeof (result.inputStyle.gradientColor) != 'undefined') {
                        this.wwObject.content.data.input.style.backgroundColor = result.inputStyle.gradientColor;
                    }
                    if (typeof (result.inputStyle.padding) != 'undefined') {
                        this.wwObject.content.data.input.style.padding = result.inputStyle.padding;
                    }
                }
                /*=============================================m_ÔÔ_m=============================================\
                  INPUT CONFIG
                \================================================================================================*/
                this.wwObject.content.data.input.config = this.wwObject.content.data.input.config || {};
                if (typeof (result.inputConfig) != 'undefined') {
                    if (typeof (result.inputConfig.type) != 'undefined') {
                        this.wwObject.content.data.input.config.type = result.inputConfig.type;
                    }
                    if (typeof (result.inputConfig.required) != 'undefined') {
                        this.wwObject.content.data.input.config.required = result.inputConfig.required;
                    }
                    if (typeof (result.inputConfig.name) != 'undefined') {
                        this.wwObject.content.data.input.config.name = result.inputConfig.name;
                    }
                    if (typeof (result.inputConfig.placeholder) != 'undefined') {
                        this.wwObject.content.data.input.config.placeholder = result.inputConfig.placeholder;
                    }
                    if (typeof (result.inputConfig.pattern) != 'undefined') {
                        this.wwObject.content.data.input.config.pattern = result.inputConfig.pattern;
                    }
                }
                /*=============================================m_ÔÔ_m=============================================\
                  WEWEB SERVICE
                \================================================================================================*/
                this.wwObject.content.data.button.weweb = this.wwObject.content.data.button.weweb || {};
                if (typeof (result.wewebService) != 'undefined') {
                    if (typeof (result.wewebService.enabled) != 'undefined') {
                        this.wwObject.content.data.button.config.weweb.enabled = result.wewebService.enabled;
                    }
                    if (typeof (result.wewebService.recipients) != 'undefined') {
                        this.wwObject.content.data.button.config.weweb.recipients = result.wewebService.recipients;
                    }
                }
                this.wwObjectCtrl.update(this.wwObject);
                this.wwObjectCtrl.globalEdit(result);
            } catch (error) {
                console.log(error);
            }
            wwLib.wwObjectHover.removeLock();
        }
        /* wwManager:end */
    },
    created () {
        this.init()
    },
    mounted: function () {
        this.$emit('ww-loaded', this)
    }
};
</script>

<style lang="scss" scoped>
.ww-form {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .elem-button {
        cursor: pointer;
    }
    .elem-input {
        width: 100%;
        .input {
            width: 100%;
            outline: none;
        }
    }
    .error-message {
        color: red;
        font-size: 70%;
    }
}
</style>