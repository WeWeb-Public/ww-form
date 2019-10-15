<template>
    <div class="ww-form">
        <!-- TYPE BUTTON -->
        <div v-if="wwObject.content.data.type === 'button'" class="elem-button">
            <span @click="submit()" :class="{'loading-button': loading}">
                <wwObject :ww-object="wwObject.content.data.button.wwObject"></wwObject>
                <span class="error-message">{{lang.getText(message)}}</span>
            </span>

            <div v-if="loading" class="loading"></div>
        </div>
        <!-- TYPE INPUT -->
        <div class="elem-input" v-if="wwObject.content.data.type === 'input'">
            <input class="input" :class="`ww-form-${wwObject.content.data.formId}`" :type="wwObject.content.data.input.config.type" :name="wwObject.content.data.input.config.name" :required="wwObject.content.data.input.config.required" :pattern="wwObject.content.data.input.config.pattern" :placeholder="wwObject.content.data.input.config.placeholder" :style="inputStyle" />
        </div>
        <!-- TYPE TEXTAREA -->
        <div class="elem-input" v-if="wwObject.content.data.type === 'textarea'">
            <textarea class="textarea" :class="`ww-form-${wwObject.content.data.formId}`" :name="wwObject.content.data.textarea.config.name" :required="wwObject.content.data.textarea.config.required" :placeholder="wwObject.content.data.textarea.config.placeholder" :rows="wwObject.content.data.textarea.config.rows || 4" :style="textAreaStyle" />
        </div>
        <!-- TYPE CHECKBOX -->
        <div class="elem-checkbox" v-if="wwObject.content.data.type === 'checkbox'">
            <div class="checkbox">
                <input :class="`ww-form-${wwObject.content.data.formId}`" type="checkbox" :name="wwObject.content.data.checkbox.config.name" :required="wwObject.content.data.checkbox.config.required" :style="checkboxStyle" />
            </div>
            <div class="checkbox-text">
                <wwObject :id="`ww-form-chekbox-text-${wwObject.id}`" :ww-object="wwObject.content.data.checkbox.wwObject"></wwObject>
            </div>
        </div>
        <!-- TYPE FILE -->
        <div class="elem-file" v-if="wwObject.content.data.type === 'file'">
            <wwObject class="input-button" :ww-object="wwObject.content.data.file.wwObject" @click.native="selectFile($event)"></wwObject>
            <div class>{{selectedFile}}</div>

            <input type="file" class="file-input" :id="`ww-form-file-${wwObject.id}`" @change="setSelectedFile($event)" :class="`ww-form-${wwObject.content.data.formId}`" :name="wwObject.content.data.file.config.name" :required="wwObject.content.data.file.config.required" />
        </div>
    </div>
</template>


<script>
/* wwManager:start */
import wwFormPopupConfig from './popup/wwFormPopupConfig.vue'
import wwInputPopupStyle from './popup/input/wwInputPopupStyle.vue'
import wwInputPopupConfig from './popup/input/wwInputPopupConfig.vue'
import wwTextareaPopupStyle from './popup/textarea/wwTextareaPopupStyle.vue'
import wwTextareaPopupConfig from './popup/textarea/wwTextareaPopupConfig.vue'
import wwCheckboxPopupConfig from './popup/checkbox/wwCheckboxPopupConfig.vue'
import wwFilePopupConfig from './popup/file/wwFilePopupConfig.vue'
import wwWeWebServicePopup from './popup/service/wwWeWebServicePopup.vue'

wwLib.wwPopups.addPopup('wwFormPopupConfig', wwFormPopupConfig)
wwLib.wwPopups.addPopup('wwInputPopupConfig', wwInputPopupConfig)
wwLib.wwPopups.addPopup('wwInputPopupStyle', wwInputPopupStyle)
wwLib.wwPopups.addPopup('wwTextareaPopupConfig', wwTextareaPopupConfig)
wwLib.wwPopups.addPopup('wwTextareaPopupStyle', wwTextareaPopupStyle)
wwLib.wwPopups.addPopup('wwCheckboxPopupConfig', wwCheckboxPopupConfig)
wwLib.wwPopups.addPopup('wwFilePopupConfig', wwFilePopupConfig)
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
    data() {
        return {
            loading: false,
            designName: wwLib.wwWebsiteData.getWebsiteNameFromRoute(),
            designId: wwLib.wwWebsiteData.getInfo().id,
            apiUrl: wwLib.wwApiRequests._getApiUrl(),
            messages: {
                error: {
                    en: `An error occured, please try later`,
                    fr: `Une erreur est survenue veuillez réessayer ultérieurement`
                },
                filesTooBig: {
                    en: `Max size for all combined files is 15Mb`,
                    fr: `La taille maximale pour tous les fichiers combinés est de 15Mo`
                },
                elementRequired(name) {
                    return {
                        en: `Element ${name} required`,
                        fr: `L'élément ${name} est requis`
                    }
                }
            },
            message: {},
            lang: wwLib.wwLang,
            selectedFile: '',
        }
    },
    computed: {
        wwObject() {
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
            style.boxShadow = this.getShadow(this.wwObject.content.data.input.style);
            style.padding = wwObjectStyle.padding ? (wwObjectStyle.padding / 2) + 'px ' + wwObjectStyle.padding + 'px' : '0';
            return style;
        },
        textAreaStyle() {
            let style = {};
            let wwObjectStyle = this.wwObject.content.data.textarea.style || {};
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
            style.boxShadow = this.getShadow(this.wwObject.content.data.textarea.style);
            style.padding = wwObjectStyle.padding ? (wwObjectStyle.padding / 2) + 'px ' + wwObjectStyle.padding + 'px' : '0';
            return style;
        }
    },
    beforeDestroy() { },
    methods: {
        init() {
            this.wwObject.content.data = this.wwObject.content.data || {}
            // FORM
            this.wwObject.content.data.type = this.wwObject.content.data.type || 'button'
            this.wwObject.content.data.formId = this.wwObject.content.data.formId || wwLib.wwWebsiteData.getCurrentPageId()

            // BUTTON
            this.wwObject.content.data.button = this.wwObject.content.data.button || {}
            this.wwObject.content.data.button.config = this.wwObject.content.data.button.config || { weweb: { enabled: true, recipients: [{ address: { email: 'damien@weweb.io' } }] }, api: {} } // need update data arch
            this.wwObject.content.data.button.wwObject = this.wwObject.content.data.button.wwObject || wwLib.wwObject.getDefault({ type: 'ww-button' })

            // INPUT
            this.wwObject.content.data.input = this.wwObject.content.data.input || {}
            this.wwObject.content.data.input.config = this.wwObject.content.data.input.config || {}
            this.wwObject.content.data.input.style = this.wwObject.content.data.input.style || {}

            // TEXTAREA
            this.wwObject.content.data.textarea = this.wwObject.content.data.textarea || {}
            this.wwObject.content.data.textarea.config = this.wwObject.content.data.textarea.config || {}
            this.wwObject.content.data.textarea.style = this.wwObject.content.data.textarea.style || {}

            // CHECKBOX
            this.wwObject.content.data.checkbox = this.wwObject.content.data.checkbox || {}
            this.wwObject.content.data.checkbox.config = this.wwObject.content.data.checkbox.config || {}
            this.wwObject.content.data.checkbox.wwObject = this.wwObject.content.data.checkbox.wwObject || wwLib.wwObject.getDefault({ type: 'ww-text' })

            // FILE
            this.wwObject.content.data.file = this.wwObject.content.data.file || {}
            this.wwObject.content.data.file.config = this.wwObject.content.data.file.config || {}
            this.wwObject.content.data.file.wwObject = this.wwObject.content.data.file.wwObject || wwLib.wwObject.getDefault({ type: 'ww-button' })

            this.wwObjectCtrl.update(this.wwObject)
        },
        getShadow(wwObjectStyle) {
            wwObjectStyle = wwObjectStyle || {};
            const shadow = wwObjectStyle.boxShadow || {};
            if (shadow.x || shadow.y || shadow.b || shadow.s || shadow.c) {
                return shadow.x + 'px ' + shadow.y + 'px ' + shadow.b + 'px ' + shadow.s + 'px ' + shadow.c;
            }
            return '';
        },
        goToPage(pageId) {
            const path = wwLib.wwWebsiteData.getPageRoute(pageId, true) || '/';
            wwLib.$router.push(path);
            this.$emit('next', null);
        },
        selectFile(event) {
            if (!this.wwObjectCtrl.getSectionCtrl().getEditMode()) {
                event.preventDefault();
                event.stopPropagation();
                const input = this.$el.querySelector('.file-input');
                input.click();
            }
        },
        setSelectedFile(event) {
            if (event.target.files && event.target.files.length) {
                this.selectedFile = event.target.files[0].name;
            }
        },
        // SEND FORM 
        async wewebSubmit() {

            if (this.loading) {
                return;
            }

            this.loading = true;
            try {
                const formData = new FormData();

                const formInputs = document.getElementsByClassName(`ww-form-${this.wwObject.content.data.formId}`)

                formData.append('ww-type', 'form');
                formData.append('ww-from', this.designName);
                formData.append('ww-recipients', JSON.stringify(this.wwObject.content.data.button.config.weweb.recipients));

                let currentSize = 0;

                for (const input of formInputs) {
                    let isError = false
                    const formElem = {
                        displayName: input.name + '',
                        value: input.value
                    }
                    if (input.type === 'checkbox') {
                        const element = document.getElementById(`ww-form-chekbox-text-${this.wwObject.id}`);
                        formElem.displayName = element.innerText;
                        formElem.value = (input.checked) ? ('checked') : ('not checked');
                        if (input.required && !input.checked) isError = true;
                        formData.append(formElem.displayName, input.value);
                    }
                    else if (input.type === 'file') {
                        formElem.value = input.files.length ? input.files[0] : false;
                        if (input.required && !formElem.value) isError = true;
                        formData.append(formElem.displayName, formElem.value);
                        currentSize += formElem.value.size;
                    }
                    else {
                        formData.append(formElem.displayName, input.value);
                        if (input.required && !formElem.value.length) isError = true;
                    }


                    if (isError) {
                        this.message = this.messages.elementRequired(input.name);
                        this.loading = false;
                        return
                    }

                    if (currentSize > 15000000) {
                        this.message = this.messages.filesTooBig;
                        this.loading = false;
                        return
                    }

                }


                await axios({
                    method: 'post',
                    url: `${this.apiUrl}/design/${this.designId}/send_form_info`,
                    data: formData
                })

                const popup = wwLib.wwLinkPopups.getPopup(this.$el);
                if (popup) {
                    popup.close();
                }

                this.goToPage(this.wwObject.content.data.button.config.weweb.linkPage);
                this.message = {}
            } catch (err) {
                console.log(err)
                this.message = this.messages.error
            }
            this.loading = false;
        },
        async apiSubmit() {

            if (this.loading) {
                return;
            }

            this.loading = true;
            try {
                const formData = {};

                const formInputs = document.getElementsByClassName(`ww-form-${this.wwObject.content.data.formId}`)

                let currentSize = 0;

                for (const input of formInputs) {
                    let isError = false
                    const formElem = {
                        displayName: input.name + '',
                        value: input.value
                    }
                    if (input.type === 'checkbox') {
                        const element = document.getElementById(`ww-form-chekbox-text-${this.wwObject.id}`);
                        formElem.displayName = element.innerText;
                        formElem.value = (input.checked) ? ('checked') : ('not checked');
                        if (input.required && !input.checked) isError = true;
                        formData[formElem.displayName] = input.value;
                    }
                    else if (input.type === 'file') {
                        formElem.value = input.files.length ? input.files[0] : false;
                        if (input.required && !formElem.value) isError = true;
                        formData[formElem.displayName] = formElem.value;
                        currentSize += formElem.value.size;
                    }
                    else {
                        formData[formElem.displayName] = input.value;
                        if (input.required && !formElem.value.length) isError = true;
                    }


                    if (isError) {
                        this.message = this.messages.elementRequired(input.name);
                        this.loading = false;
                        return
                    }

                    if (currentSize > 15000000) {
                        this.message = this.messages.filesTooBig;
                        this.loading = false;
                        return
                    }

                }


                await axios({
                    method: this.wwObject.content.data.button.config.api.method,
                    url: this.wwObject.content.data.button.config.api.url,
                    data: formData
                })

                this.goToPage(this.wwObject.content.data.button.config.api.linkPage);
                this.message = {}
            } catch (err) {
                console.log(err)
                this.message = this.messages.error
            }
            this.loading = false;
        },

        async submit() {
            try {
                if (this.wwObject.content.data.button.config.weweb.enabled) {
                    await this.wewebSubmit()
                }
                if (this.wwObject.content.data.button.config.api.enabled) {
                    await this.apiSubmit()
                }
            } catch (err) {
                console.log(err)
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
                        // TYPE TEXTAREA
                        EDIT_TEXTAREA_CONFIG: {
                            separator: {
                                en: 'Text area element',
                                fr: 'Zone de texte'
                            },
                            title: {
                                en: 'Change text area config',
                                fr: 'Changer la configuration de la zone de texte'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-icon',
                            shortcut: 'c',
                            hidden: this.wwObject.content.data.type !== 'textarea',
                            next: 'WWTEXTAREA_CONFIG'
                        },
                        EDIT_TEXTAREA_STYLE: {
                            title: {
                                en: 'Change text area style',
                                fr: 'Changer l\'apparence de la zone de texte'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-edit-style',
                            shortcut: 's',
                            hidden: this.wwObject.content.data.type !== 'textarea',
                            next: 'WWTEXTAREA_STYLE'
                        },
                        // TYPE CHECKBOX
                        EDIT_CHECKBOX_CONFIG: {
                            separator: {
                                en: 'Checkbox element',
                                fr: 'Case à cocher'
                            },
                            title: {
                                en: 'Change checkbox config',
                                fr: 'Changer la config de la case à cocher'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-icon',
                            shortcut: 'c',
                            hidden: this.wwObject.content.data.type !== 'checkbox',
                            next: 'WWCHECKBOX_CONFIG'
                        },
                        // TYPE FILE
                        EDIT_FILE_CONFIG: {
                            separator: {
                                en: 'File upload element',
                                fr: 'Upload de fichier'
                            },
                            title: {
                                en: 'Change file upload config',
                                fr: 'Changer la config du fichier à uploader'
                            },
                            desc: {
                                en: '',
                                fr: ''
                            },
                            icon: 'wwi wwi-icon',
                            shortcut: 'c',
                            hidden: this.wwObject.content.data.type !== 'file',
                            next: 'WWFILE_CONFIG'
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
                            next: 'WW_SERVICE_ACTION_API'
                        },
                    }
                }
            })
            // API POPUP
            wwLib.wwPopups.addStory('WW_SERVICE_ACTION_API', {
                title: {
                    en: 'Edit API info',
                    fr: 'Editer les infos de l\'API'
                },
                type: 'wwPopupForm',
                storyData: {
                    fields: [
                        {
                            label: {
                                en: 'API URL :',
                                fr: 'URL de l\'API :'
                            },
                            desc: {
                                en: 'Form data will be sent to this URL.',
                                fr: 'Les données du formulaire seront envoyées à cette URL.'
                            },
                            type: 'text',
                            key: 'apiUrl',
                            valueData: 'wwObject.content.data.button.config.api.url',
                            validation: {
                                regex: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6})?\b([-a-zA-Z0-9@:%_\+.~#?&//=\,]*)$/gi,
                                message: {
                                    en: 'URL is in incorrect format.',
                                    fr: 'l\'url est dans un format incorrect.',
                                }
                            }
                        },
                        {
                            label: {
                                en: 'Method :',
                                fr: 'Méthode :'
                            },
                            desc: {
                                en: 'Method that will be used to call the API URL',
                                fr: 'Méthode utilisée pour appeler l\'API'
                            },
                            type: 'select',
                            key: 'apiMethod',
                            valueData: 'wwObject.content.data.button.config.api.method',
                            options: {
                                wwObject: {},
                                values: [
                                    {
                                        value: 'post',
                                        default: true,
                                        text: {
                                            en: 'POST',
                                            fr: 'POST'
                                        }
                                    },
                                    {
                                        value: 'get',
                                        text: {
                                            en: 'GET',
                                            fr: 'GET'
                                        }
                                    },
                                    {
                                        value: 'delete',
                                        text: {
                                            en: 'DELETE',
                                            fr: 'DELETE'
                                        }
                                    },
                                    {
                                        value: 'put',
                                        text: {
                                            en: 'PUT',
                                            fr: 'PUT'
                                        }
                                    },
                                ]
                            }
                        }
                    ]
                },
                buttons: {
                    OK: {
                        text: {
                            en: 'Next',
                            fr: 'Suivant'
                        },
                        next: 'LINK_INTERNAL'
                    }
                }
            });
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
            // TEXTAREA POPUP
            wwLib.wwPopups.addStory('WWTEXTAREA_CONFIG', {
                title: {
                    en: 'Text area Config',
                    fr: 'Configuration de la zone de texte'
                },
                type: 'wwTextareaPopupConfig',
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
            wwLib.wwPopups.addStory('WWTEXTAREA_STYLE', {
                title: {
                    en: 'Text area style',
                    fr: 'Style de la zone de texte'
                },
                type: 'wwTextareaPopupStyle',
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
            // CHECKBOX POPUP
            wwLib.wwPopups.addStory('WWCHECKBOX_CONFIG', {
                title: {
                    en: 'Checkbox Config',
                    fr: 'Configuration de la case à cocher'
                },
                type: 'wwCheckboxPopupConfig',
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
            // FILE POPUP
            wwLib.wwPopups.addStory('WWFILE_CONFIG', {
                title: {
                    en: 'File Config',
                    fr: 'Configuration de la case à cocher'
                },
                type: 'wwFilePopupConfig',
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

            let copyObj = JSON.parse(JSON.stringify(this.wwObject)) // to clean
            copyObj.uniqueId += 1
            console.log(copyObj);
            let options = {
                firstPage: 'WWFORM_EDIT',
                data: {
                    wwObject: copyObj,
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
                  TEXTAREA STYLE
                \================================================================================================*/
                this.wwObject.content.data.textarea.style = this.wwObject.content.data.textarea.style || {};
                if (typeof (result.textareaStyle) != 'undefined') {
                    if (typeof (result.textareaStyle.borderColor) != 'undefined') {
                        this.wwObject.content.data.textarea.style.borderColor = result.textareaStyle.borderColor;
                    }
                    if (typeof (result.textareaStyle.borderRadius) != 'undefined') {
                        this.wwObject.content.data.textarea.style.borderRadius = result.textareaStyle.borderRadius;
                    }
                    if (typeof (result.textareaStyle.borderStyle) != 'undefined') {
                        this.wwObject.content.data.textarea.style.borderStyle = result.textareaStyle.borderStyle;
                    }
                    if (typeof (result.textareaStyle.borderWidth) != 'undefined') {
                        this.wwObject.content.data.textarea.style.borderWidth = result.textareaStyle.borderWidth;
                    }
                    if (typeof (result.textareaStyle.boxShadow) != 'undefined') {
                        this.wwObject.content.data.textarea.style.boxShadow = result.textareaStyle.boxShadow;
                    }
                    if (typeof (result.textareaStyle.backgroundColor) != 'undefined') {
                        this.wwObject.content.data.textarea.style.backgroundColor = result.textareaStyle.backgroundColor;
                    }
                    if (typeof (result.textareaStyle.gradient) != 'undefined') {
                        this.wwObject.content.data.textarea.style.gradient = result.textareaStyle.gradient;
                    }
                    if (typeof (result.textareaStyle.gradientColor) != 'undefined') {
                        this.wwObject.content.data.textarea.style.backgroundColor = result.textareaStyle.gradientColor;
                    }
                    if (typeof (result.textareaStyle.padding) != 'undefined') {
                        this.wwObject.content.data.textarea.style.padding = result.textareaStyle.padding;
                    }
                }
                /*=============================================m_ÔÔ_m=============================================\
                  TEXTAREA CONFIG
                \================================================================================================*/
                this.wwObject.content.data.textarea.config = this.wwObject.content.data.textarea.config || {};
                if (typeof (result.textareaConfig) != 'undefined') {
                    if (typeof (result.textareaConfig.rows) != 'undefined') {
                        this.wwObject.content.data.textarea.config.rows = result.textareaConfig.rows;
                    }
                    if (typeof (result.textareaConfig.required) != 'undefined') {
                        this.wwObject.content.data.textarea.config.required = result.textareaConfig.required;
                    }
                    if (typeof (result.textareaConfig.name) != 'undefined') {
                        this.wwObject.content.data.textarea.config.name = result.textareaConfig.name;
                    }
                    if (typeof (result.textareaConfig.placeholder) != 'undefined') {
                        this.wwObject.content.data.textarea.config.placeholder = result.textareaConfig.placeholder;
                    }
                }
                /*=============================================m_ÔÔ_m=============================================\
                  CHECKBOX CONFIG
                \================================================================================================*/
                this.wwObject.content.data.checkbox.config = this.wwObject.content.data.checkbox.config || {};
                if (typeof (result.checkboxConfig) != 'undefined') {
                    if (typeof (result.checkboxConfig.rows) != 'undefined') {
                        this.wwObject.content.data.checkbox.config.rows = result.checkboxConfig.rows;
                    }
                    if (typeof (result.checkboxConfig.required) != 'undefined') {
                        this.wwObject.content.data.checkbox.config.required = result.checkboxConfig.required;
                    }
                    if (typeof (result.checkboxConfig.name) != 'undefined') {
                        this.wwObject.content.data.checkbox.config.name = result.checkboxConfig.name;
                    }
                    if (typeof (result.checkboxConfig.placeholder) != 'undefined') {
                        this.wwObject.content.data.checkbox.config.placeholder = result.checkboxConfig.placeholder;
                    }
                }
                /*=============================================m_ÔÔ_m=============================================\
                  FILE CONFIG
                \================================================================================================*/
                this.wwObject.content.data.file.config = this.wwObject.content.data.file.config || {};
                if (typeof (result.fileConfig) != 'undefined') {
                    if (typeof (result.fileConfig.required) != 'undefined') {
                        this.wwObject.content.data.file.config.required = result.fileConfig.required;
                    }
                    if (typeof (result.fileConfig.name) != 'undefined') {
                        this.wwObject.content.data.file.config.name = result.fileConfig.name;
                    }
                }
                /*=============================================m_ÔÔ_m=============================================\
                  WEWEB SERVICE
                \================================================================================================*/
                this.wwObject.content.data.button.config = this.wwObject.content.data.button.config || {};
                this.wwObject.content.data.button.config.weweb = this.wwObject.content.data.button.config.weweb || {};
                if (typeof (result.wewebService) != 'undefined') {
                    this.wwObject.content.data.button.config.api = {};
                    if (typeof (result.wewebService.enabled) != 'undefined') {
                        this.wwObject.content.data.button.config.weweb.enabled = result.wewebService.enabled;
                    }
                    if (typeof (result.wewebService.recipients) != 'undefined') {
                        this.wwObject.content.data.button.config.weweb.recipients = result.wewebService.recipients;
                    }
                    if (typeof (result.linkPage) != 'undefined') {
                        this.wwObject.content.data.button.config.weweb.linkPage = result.linkPage;
                    }
                }
                /*=============================================m_ÔÔ_m=============================================\
                  API SERVICE
                \================================================================================================*/
                this.wwObject.content.data.button.config.api = this.wwObject.content.data.button.config.api || {};
                if (typeof (result.apiUrl) != 'undefined' && typeof (result.apiMethod) != 'undefined') {
                    this.wwObject.content.data.button.config.weweb = {};
                    this.wwObject.content.data.button.config.api.enabled = true;
                    this.wwObject.content.data.button.config.api.url = result.apiUrl;
                    this.wwObject.content.data.button.config.api.method = result.apiMethod;
                    if (typeof (result.linkPage) != 'undefined') {
                        this.wwObject.content.data.button.config.api.linkPage = result.linkPage;
                    }
                }
                this.wwObjectCtrl.update(this.wwObject);
                // this.wwObjectCtrl.globalEdit(result);
            } catch (error) {
                console.log(error);
            }
            wwLib.wwObjectHover.removeLock();
        }
        /* wwManager:end */
    },
    created() {
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
        position: relative;

        .loading-button {
            opacity: 0;
            visibility: hidden;
        }

        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: inline-block;
            width: 40px;
            height: 40px;
        }

        .loading:after {
            content: " ";
            display: block;
            width: 30px;
            height: 30px;
            margin: 1px;
            border-radius: 50%;
            border: 3px solid #000;
            border-color: #000 transparent #000 transparent;
            animation: loading 1.2s linear infinite;
        }
    }
    .elem-input {
        width: 100%;
        .input {
            width: 100%;
            outline: none;
        }
        .textarea {
            width: 100%;
            outline: none;
            resize: none;
        }
    }
    .elem-checkbox {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        .checkbox {
            outline: none;
            margin-right: 10px;
        }
        .checkbox-text {
            width: 100%;
        }
    }
    .elem-file {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .input-button {
            cursor: pointer;
            flex-shrink: 0;
            margin-right: 10px;
        }

        input {
            opacity: 0;
            visibility: hidden;
            position: absolute;
        }
    }
    .error-message {
        color: red;
        font-size: 70%;
    }
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>