const { VK } = require('vk-io'); // Экспортируем модуль "VK-IO" (Он нам нужен ДЛЯ работы с ВК (ВКонтакте)).
const bot = require('./config.js').bot; // ЭКСПОРТИРУЕМ ТОКЕН/ID страницы.
const vk = new VK();

vk.setOptions({
  token: bot.token
})

const st = vk.updates; // Мне так удобней.
const user = require('./user.json'); // Эскопртируем "Базу Данных"

st.on(['new_message'], async (ctx,next) => {
  // if(ctx.senderId === bot.id) return; // Если хотите, чтобы Вы сами Себе отвечали, то уберите это.  if(ctx.senderId === bot.id) return;
  await next();
})

st.hear(/^\!(?:привет|hello|hey)$/i, async ctx => {
  let id = ctx.senderId;
  let u = user.find(x=> x.id === id);

  if(!u){
    const [l] = await vk.api.users.get({user_id: id});
    return ctx.send(`[id${id}|${l.first_name} ${l.last_name}], Привет!`);
  } else {
    return ctx.send(`${u.push}, Привет!`)
  }
})
st.hear(/^\!(?:пока|byu|бб|bb)$/i, async ctx => {
  let id = ctx.senderId;
  let u = user.find(x=> x.id === id);

  if(!u){
    const [l] = await vk.api.users.get({user_id: id});
    return ctx.send(`[id${id}|${l.first_name} ${l.last_name}], Пока! :c`);
  } else {
    return ctx.send(`${u.push}, Пока! :c`)
  }
})

st.hear(/^\!(?:рег|регистрация|reg|registration)$/i, async ctx => {
  let id = ctx.senderId;
  let u = user.find(x=> x.id === id);

  if(!u){
    const [l] = await vk.api.users.get({user_id: ctx.senderId});
    user.push({
      id: id,
      first_name: l.first_name,
      last_name: l.last_name,
      sex: !l.sex ? 0 : l.sex,
      name: `${l.first_name} ${l.last_name}`,
      push: `[id${id}|${l.first_name} ${l.last_name}]`
    })
    require('fs').writeFileSync('./user.json', JSON.stringify(user, null, '\t')); // Сохраняем "Базу Данных".
    return ctx.send(`Я [id${id}|Тебя] успешно зарегистрировал. :)`);
  } else {
    return ctx.send(`[id${id}|Ты] уже зареган. :)`);
  }

})

st.hear(/^\!(?:кто я|кто ты|ты кто|я кто)([?])/i, async ctx => {
  let u = user.find(x=> x.id === id);
  return ctx.send(`Я знаю кто Ты: ${u.push} .`)
})

st.startPolling();
