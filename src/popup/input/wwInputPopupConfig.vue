<template>
    <div class="ww-popup-config">
        <div class="content">
            <div class="elem">
                <div class="title">Type</div>
                <wwManagerSelect class="option" :options="typeOptions" :value="result.inputConfig.type" @change="result.inputConfig.type = $event"></wwManagerSelect>
            </div>
            <div class="elem">
               <div class="title">Required</div>
                <wwManagerRadio class="radio" v-model="result.inputConfig.required"></wwManagerRadio>
            </div>
            <div class="elem">
                <wwManagerInput class="input" color="orange" v-model="result.inputConfig.name" :label="`Name`"></wwManagerInput>
            </div>
            <div class="elem">
                <wwManagerInput class="input" color="green" v-model="result.inputConfig.placeholder" :label="`Placeholder`"></wwManagerInput>
            </div>
            <!-- <div class="elem">
                <wwManagerInput class="input" color="green" v-model="result.inputConfig.pattern" :label="`Pattern`"></wwManagerInput>
            </div> -->
        </div>
    </div>
</template>

<script> 
export default {
    name: "wwInputPopupStyle",
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
            result: {
                inputConfig: {
                    type: undefined,
                    required: false
                }
            },
            typeOptions: {
                type: 'text',
                values: [
                    {
                        value: 'text',
                        default: true,
                        text: {
                            en: 'Text',
                            fr: 'Texte'
                        }
                    },
                    {
                        value: 'email',
                        text: {
                            en: 'Email',
                            fr: 'Email'
                        }
                    },
                    {
                        value: 'tel',
                        text: {
                            en: 'Phone',
                            fr: 'Téléphone'
                        }
                    },
                    {
                        value: 'color',
                        text: {
                            en: 'Color',
                            fr: 'Couleur'
                        }
                    },
                    {
                        value: 'password',
                        text: {
                            en: 'Password',
                            fr: 'Password'
                        }
                    },
                    {
                        value: 'url',
                        text: {
                            en: 'Url',
                            fr: 'Url'
                        }
                    }
                ]
            }
        };
    },
    computed: {
    },
    watch: {
    },
    methods: {
        init() {
            this.result.inputConfig.type = this.wwObject.content.data.input.config.type
            this.result.inputConfig.required = this.wwObject.content.data.input.config.required || false
            this.result.inputConfig.name = this.wwObject.content.data.input.config.name
            this.result.inputConfig.placeholder = this.wwObject.content.data.input.config.placeholder
            this.result.inputConfig.pattern = this.wwObject.content.data.input.config.pattern
            this.options.result = this.result
        },
    },
    created: function () {
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
        .elem {
            margin: 10px 33%;
            width: 33%;
            .input {
                width: 100%;
            }
            .select {
                width: 33%;
            }
            .radio {
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
