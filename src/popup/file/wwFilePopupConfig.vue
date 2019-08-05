<template>
    <div class="ww-popup-config">
        <div class="content">
            <div class="elem">
                <div class="title">Required</div>
                <wwManagerRadio class="radio" v-model="result.fileConfig.required"></wwManagerRadio>
            </div>
            <div class="elem">
                <wwManagerInput class="input" color="orange" v-model="result.fileConfig.name" :label="`Name`"></wwManagerInput>
            </div>
        </div>
    </div>
</template>

<script> 
export default {
    name: "wwFilePopupStyle",
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
                fileConfig: {
                    required: false
                }
            },
        };
    },
    computed: {
    },
    watch: {
    },
    methods: {
        init() {
            this.result.fileConfig.required = this.options.data.wwObject.data.file.config.required || false
            this.result.fileConfig.name = this.options.data.wwObject.data.file.config.name
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
