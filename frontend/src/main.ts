import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { InstallCodemirro } from 'codemirror-editor-vue3';
import globalComponents from '@/components';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import App from './App.vue';
import '@/assets/style/global.less';
import '@/api/interceptor';
import ElementPlus from 'element-plus';

const app = createApp(App);

app.use(globalComponents);
app.config.warnHandler = () => null;

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(ElementPlus);

app.use(router);
app.use(store);
app.use(i18n);
app.use(directive);
app.use(InstallCodemirro);

app.mount('#app');
