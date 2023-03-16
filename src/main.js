import { waitFor, bcModSDK, OnActivity } from './utils';
import { hypnoActivated } from './hypno';
import { } from './collar';

const SeraScripts_Version = '0.0.1';

await waitFor(() => ServerSocket && ServerIsConnected);	

const SDK = bcModSDK.registerMod({
    name: 'SeraScripts',
    fullName: 'Sera Scripts',
    version: SeraScripts_Version
});

window.SeraScripts_Version = SeraScripts_Version

// wait for actual player
await waitFor(() => !!Player?.AccountName);

OnActivity(100, "Little Sera Boops", (data, msg, sender, metadata) => {
    let target = data.Dictionary.find(d => d.Tag == "TargetCharacter");
    if (!!target && 
        target.MemberNumber == Player.MemberNumber && 
        data.Content == "ChatOther-ItemNose-Pet" && 
        !hypnoActivated()) {
        BoopReact(sender.MemberNumber);
    }
});


// Boops

const normalBoopReactions = [
    "%NAME% wiggles her nose.",
    "%NAME% wiggles her nose with a small frown.",
    "%NAME% sneezes in surprise.",
    "%NAME% looks crosseyed at her nose.",
    "%NAME% wiggles her nose with a squeak.",
    "%NAME% meeps!"
]

const protestBoopReactions = [
    "%NAME% swats at %OPP_NAME%'s hand.",
    "%NAME% covers her nose protectively, squinting at %OPP_NAME%.",
    "%NAME% snatches %OPP_NAME%'s booping finger."
]

const bigProtestBoopReactions = [
    "%NAME%'s nose overloads and shuts down."
]

const boundBoopReactions = [
    "%NAME% struggles in her bindings, huffing.",
    "%NAME% frowns and squirms in her bindings.",
    "%NAME% whimpers in her bondage.",
    "%NAME% groans helplessly.",
    "%NAME% whines and wiggles in her bondage."
]

boops = 0;
boopShutdown = false;
boopDecreaseLoop = setInterval(() => {
    if (boops > 0)
        boops--;
}, 5000);

function BoopReact(booperId) {
    if (boopShutdown)
        return;

    var booper = ChatRoomCharacter.find(c => c.MemberNumber == booperId);
    if (booper)
        boops++;
    
    if (boops >= 5)
        BigProtestBoopReact(booper);            
    else if (boops >= 3)
        ProtestBoopReact(booper);
    else
        NormalBoopReact();
}

function NormalBoopReact() {
    CharacterSetFacialExpression(Player, "Blush", "Low");
    SendAction(normalBoopReactions[getRandomInt(normalBoopReactions.length)]);
}

function ProtestBoopReact(booper) {
    CharacterSetFacialExpression(Player, "Blush", "Medium");
    CharacterSetFacialExpression(Player, "Eyes", "Daydream");

    if (Player.IsRestrained())
        SendAction(boundBoopReactions[getRandomInt(boundBoopReactions.length)]);
    else
        SendAction(protestBoopReactions[getRandomInt(protestBoopReactions.length)], booper.Nickname);
}

function BigProtestBoopReact(booper) {
    CharacterSetFacialExpression(Player, "Blush", "High");
    CharacterSetFacialExpression(Player, "Eyes", "Dizzy");
    SendAction(bigProtestBoopReactions[getRandomInt(bigProtestBoopReactions.length)]);
    boopShutdown = true;
    setTimeout(() => boopShutdown = false, 30000);
}