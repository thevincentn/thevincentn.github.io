function ExecuteScript(strId)
{
  switch (strId)
  {
      case "5vgwLa9Kjph":
        Script1();
        break;
  }
}

function Script1()
{
  var player = GetPlayer();
var ans1 = player.GetVar("Answer_1");
var ans2 = player.GetVar("Answer_2");
var ans3 = player.GetVar("Answer_3");
var ans4 = player.GetVar("Answer_4");
var ans5 = player.GetVar("Answer_5");
var ans6 = player.GetVar("Answer_6");
var ans7 = player.GetVar("Answer_7");
var ans8 = player.GetVar("Answer_8");

player.SetVar("SpendScore",Math.ceil((ans1+ans2)/2));
player.SetVar("SaveScore",Math.ceil((ans3+ans4)/2));
player.SetVar("BorrowScore",Math.ceil((ans5+ans6)/2));
player.SetVar("PlanScore",Math.ceil((ans7+ans8)/2));

player.SetVar("FinHealth",Math.ceil((ans1+ans2+ans3+ans4+ans5+ans6+ans7+ans8)/8));
}

