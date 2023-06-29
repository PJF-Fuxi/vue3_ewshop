import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import "vant/lib/index.css";
import ElementPlus from 'element-plus';
import { Swipe, SwipeItem ,Lazyload ,Badge,Collapse, CollapseItem,TreeSelect,Sidebar,
    SidebarItem,Tab,Tabs,Card,Image,Tag,Button,Form, Field, CellGroup,Toast,SubmitBar,
    CheckboxGroup,SwipeCell,Stepper,Checkbox,Area,AddressList,AddressEdit,Popup, Grid, GridItem    } from 'vant';


createApp(App)
.use(Swipe).use(SwipeItem).use(Lazyload,{
    loading:require('./assets/images/default.png')})
.use(Badge)
.use(Collapse).use(CollapseItem)
.use(TreeSelect )
.use(Sidebar).use(SidebarItem)
.use(Tab).use(Tabs)
.use(Card )
.use(Image).use(Tag).use(Button)
.use(Form).use(Field).use(CellGroup)
.use(Toast )
.use(ElementPlus)
.use(SubmitBar).use(CheckboxGroup).use(SwipeCell).use(Stepper).use(Checkbox)
.use(Area).use(AddressList).use(AddressEdit)
.use(Popup)
.use(Grid).use(GridItem)
.use(store).use(router).mount('#app')

