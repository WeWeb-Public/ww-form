<template>
    <div class="ww-popup-config">
        <div class="content">
            <div class="form-id">
                <wwManagerInput class="input" color="green" v-model="result.formId" :label="`Form Id`"></wwManagerInput>
            </div>
            <div class="form-type">
                <div class="title">Element Type</div>
                <wwManagerSelect class="select" :options="typesOptions" :value="result.type" @change="result.type = $event"></wwManagerSelect>
            </div>
        </div>
    </div>
</template>

<script> 
export default {
    name: "wwFormPopupConfig",
    props: {
        options: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    data() {
        return {
            wwObject: this.options.data.wwObject,
            typesOptions: {
                type: 'text',
                values: [{
                    value: 'button',
                    default: true,
                    text: {
                        en: 'Button',
                        fr: 'Button'
                    }
                }, {
                    value: 'input',
                    text: {
                        en: 'Input',
                        fr: 'Entrée texte'
                    }
                }, {
                    value: 'textarea',
                    text: {
                        en: 'Textarea',
                        fr: 'Zone de texte'
                    }
                }, {
                    value: 'checkbox',
                    text: {
                        en: 'Checkbox',
                        fr: 'Case à cocher'
                    }
                }, {
                    value: 'file',
                    text: {
                        en: 'File upload',
                        fr: 'Upload de fichier'
                    }
                }]
            },
            result: {
                formId: undefined,
                type: undefined
            }
        }
    },
    methods: {
        init() {
            this.result.formId = this.wwObject.content.data.formId || wwLib.wwUtils.getUniqueId()
            this.result.type = this.wwObject.content.data.type || typesOptions.values[0]
            this.options.result = this.result
        }
    },
    mounted: function () {
    },
    created() {
        this.init()
    },
    beforeDestroy() {
    }
};
</script>

<style scoped lang="scss">
.ww-popup-config {
    .content {
        display: flex;
        padding: 20px;
        flex-wrap: wrap;
        overflow: auto;
        width: 100%;
        justify-content: center;
        font-family: "Monserrat", sans-serif;
        .form-id {
            margin: 20px 33%;
            width: 33%;
            .input {
                width: 100%;
            }
        }
        .form-type {
            margin: 20px 33%;
            width: 33%;
            .select {
            }
        }
        .title {
            color: #e02a4d;
            font-family: "Monserrat", sans-serif;
            font-size: 1.2rem;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 10px;
        }
    }
}
</style>
