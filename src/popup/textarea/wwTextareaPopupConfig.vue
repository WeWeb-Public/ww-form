<template>
    <div class="ww-popup-config">
        <div class="content">
            <div class="elem">
               <div class="title">Required</div>
                <wwManagerRadio class="radio" v-model="result.textareaConfig.required"></wwManagerRadio>
            </div>
            <div class="elem">
                <wwManagerInput class="input" color="orange" v-model="result.textareaConfig.name" :label="`Name`"></wwManagerInput>
            </div>
            <div class="elem">
                <wwManagerInput class="input" color="green" v-model="result.textareaConfig.placeholder" :label="`Placeholder`"></wwManagerInput>
            </div>
            <div class="elem">
                <div class="title">{{result.textareaConfig.rows}} Rows </div>
                <wwManagerSlider class="input" color="green" v-model="result.textareaConfig.rows" :label="`Rows`"></wwManagerSlider>
            </div>
        </div>
    </div>
</template>

<script> 
export default {
    name: "wwTextareaPopupStyle",
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
                textareaConfig: {
                    type: undefined,
                    required: false,
                    rows: 4
                }
            }
        };
    },
    computed: {
    },
    watch: {
    },
    methods: {
        init() {
            this.result.textareaConfig.type = this.wwObject.content.data.textarea.config.type
            this.result.textareaConfig.required = this.wwObject.content.data.textarea.config.required || false
            this.result.textareaConfig.name = this.wwObject.content.data.textarea.config.name
            this.result.textareaConfig.placeholder = this.wwObject.content.data.textarea.config.placeholder
            this.result.textareaConfig.pattern = this.wwObject.content.data.textarea.config.pattern
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
