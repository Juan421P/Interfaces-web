import { Body } from "../components/body/body.js";
import { Footer } from "../components/footer/footer.js";

new Body({
    afterLoad(){
        new Footer().load();
    }
}).load();