<template>
    <div class="ww-popup-config">
        <div class="content">
            <div class="elem">
                <div class="title">Enabled</div>
                <wwManagerRadio class="radio" v-model="result.wewebService.enabled"></wwManagerRadio>
            </div>
            <div class="elem" v-for="recipient in result.wewebService.recipients" :key="recipient.id">
                <wwManagerInput class="input" color="green" v-model="recipient.address.email" :label="`Email`"></wwManagerInput>
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
            result: {
                wewebService: {
                    enabled: false,
                    recipients: []
                }
            }
        }
    },
    methods: {
        init() {
            this.wwObject.data.button.config.weweb = this.wwObject.data.button.config.weweb || {}
            this.result.wewebService.enabled = this.wwObject.data.button.config.weweb.enabled || false
            this.result.wewebService.recipients = this.wwObject.data.button.config.weweb.recipients || [{ address: { email: '' } }]
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
        .elem {
            margin: 20px 33%;
            width: 33%;
            .input {
                width: 100%;
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
