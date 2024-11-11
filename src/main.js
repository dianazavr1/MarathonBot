const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
    }

    async start(msg){
        this.mode = "gpt"
        const text = this.loadMessage("main")
        await this.sendImage("main")
        await this.sendText(text)
        //add menu
        await this.showMainMenu({
           "start": "Начать",
            "profile": "генерация Tinder-профиля 😎",
            "opener": "сообщение для знакомства 🥰",
            "message": "переписка от вашего имени 😈",
           "gpt": "Общаемся с ИИ",
            "date": "переписка со звездами 🔥",
            "html": "Демонстрация HTML"
        })

    }
    async html(msg){
        await this.sendHTML('<h3 style="color:#1558b0">Привет</h3>')
        const html = this.loadHtml("main")
        await this.sendHTML(html,{theme:"dark"})
    }
    async gpt(msg){
        this.mode = "gpt"
        const text = this.loadMessage("gpt")
        await this.sendImage("gpt")
        await this.sendText(text)
    }
    async gptDialog(msg){
        const text = msg.text;
        const answer = await chatgpt.sendQuestion("Ответь на вопрос", text)
        await this.sendText(answer)
    }


    async hello(msg){
        if (this.mode === "gpt")
            await this.gptDialog(msg);
        else {
            const text = msg.text
            await this.sendText("<b>Привет!</b>")
            await this.sendText("<i>Как дела</i>")
            await this.sendText(`Вы писали: ${text}`)

            await this.sendImage("avatar_main")

            await this.sendTextButtons("Какая у вас тема в Телеграм?", {
                "theme_light": "Светлая",
                "theme_dark": "Темная",
            })
        }
    }
    async helloButton(callbackQuery){
        const query = callbackQuery.data
        if(query === "theme_light")
            await this.sendText("У вас светлая тема")
        if(query === "theme_dark")
            await this.sendText("У вас темная тема")

    }
}
const chatgpt = new ChatGptService("gpt:pPdqYamDV0iFkELNg02NJFkblB3Tx2WqHlm0PwDlB9pl0he8")
const bot = new MyTelegramBot("7988138042:AAEvrMA77hSam-nPn_Ia0fyLK-8dlI75qFM");

bot.onCommand(/\/start/, bot.start)
bot.onCommand(/\/html/,bot.html)
bot.onCommand(/\/gpt/,bot.gpt)
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^.*/, bot.helloButton)