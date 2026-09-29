const LINES = {
  lift: '还在。',
  done: '今天算数了。',
  again: '已经记下了，别把我摔了。',
  miss1: '我还在原地。',
  miss3: '灰比你勤快。',
  miss7: '我先不叫了。你要是还想起我，把我举起来。',
  streak3: '三天没落灰。',
  streak7: '七天。铁还是那块铁。'
}

function lineFor({ doneAlready, justDone, streak, miss }) {
  if (justDone) return LINES.done
  if (doneAlready) return LINES.again
  if (miss >= 7) return LINES.miss7
  if (miss >= 3) return LINES.miss3
  if (miss >= 1) return LINES.miss1
  if (streak >= 7) return LINES.streak7
  if (streak >= 3) return LINES.streak3
  return LINES.lift
}

module.exports = { LINES, lineFor }
