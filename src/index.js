import wwObject from './wwObjectForm.vue'

const name = "__NAME__";
const version = '__VERSION__';

const addComponent = function () {
    if (window.vm) {

        wwLib.wwObject.register({
            /* wwManager:start */
            cmsOptions: {
                wwObjectMenu: {
                    items: [
                        {
                            name: 'OPTIONS',
                            text: {
                                en: 'Options...',
                                fr: 'Options...'
                            },
                            icon: 'wwi wwi-edit-other',
                            action: 'edit'
                        }
                    ]
                }
            },
            /* wwManager:end */
            content: {
                type: name,
                data: {
                    input: {
                        config: {
                        },
                        style: {
                            borderRadius: 3,
                            borderWidth: 1,
                            borderColor: 'black',
                            borderStyle: 'solid',
                            padding: 5
                        }
                    },
                    textarea: {
                        config: {
                            rows: 4
                        },
                        style: {
                            borderRadius: 3,
                            borderWidth: 1,
                            borderColor: 'black',
                            borderStyle: 'solid',
                            padding: 5
                        }
                    }
                }
            },
            upsales: {
                wwAnalytics: {
                    click: true
                }
            }
        });

        window.vm.addComponent({
            name: name,
            version: version,
            content: wwObject
        });

        return true;
    }
    return false;
}

if (!addComponent()) {
    const iniInterval = setInterval(function () {
        if (addComponent()) {
            clearInterval(iniInterval);
        }
    }, 10);
}