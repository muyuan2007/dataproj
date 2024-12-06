import {useEffect, useState} from "react"
import {Card, CardContent, Grid, Typography, Button, TextField} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import { CallReceived, Check} from "@material-ui/icons"


const baseInvestmentInfo = {
    1: {type: "re", name: "Multifamily", value: 15000},
    2: {type: "re", name: "Office", value: 20000},
    3: {type: "re", name: "Casino", value: 40000},
    4: {type: "re", name: "Factory", value: 50000},
    5: {type: "it", name: "Intel (INTC)", value: 1000},
    6: {type: "it", name: "Cisco (CSCO)", value: 3000},
    7: {type: "it", name: "NVIDIA (NVDA)", value: 7000},
    8: {type: "it", name: "Microsoft (MSFT)", value: 14000},
    9: {type: "fx", name: "Yuan (CNY)", value: 4000},
    10: {type: "fx", name: "Euro (EUR)", value: 24000},
    11: {type: "cc", name: "Dogecoin", value: 2000},
    12: {type: "cc", name: "Litecoin", value: 5000},
    13: {type: "cc", name: "Ethereum", value: 10000},
    14: {type: "cc", name: "Bitcoin", value: 30000}
}

const investmentInfoToIds = {
    "Multifamily": "1",
    "Office": "2",
    "Casino": "3",
    "Factory": "4",
    "Intel (INTC)": "5",
    "Cisco (CSCO)": "6",
    "NVIDIA (NVDA)": "7",
    "Microsoft (MSFT)": "8",
    "Yuan (CNY)": "9",
    "Euro (EUR)": "10", 
    "Dogecoin": "11",
    "Litecoin": "12",
    "Ethereum": "13",
    "Bitcoin": "14"
}

const labels = ["Player", "Cash", "Real Estate (RE)", "I.T. (IT)", "Foreign Ex. (FX)", "Crypto (CC)", "Net Worth"]

const changes = {
    1: [1.1, 1.2, 0.95, 1.25],
    2: [0.95, 0.9, 1.1, 0.9],
    3: [1.15, 1.25, 0.9, 1.2],
    4: [0.9, 0.95, 1.15, 0.95],
    5: [1.1, 1.15, 0.9, 1.8],
    6: [1.05, 1.1, 1.2, 0.7],
    7: [1.05, 1.05, 1.45, 1.05],
    8: [1.1, 1.15, 0.8, 1.1],
    9: [1.2, 1.1, 1.1, 1.1],
    10: [0.6, 1.1, 1.1, 1.1],
    11: [1.05, 1.25, 1.05, 1.1],
    12: [1.05, 0.85, 1.05, 1.05]
}

const gridHeight = 44
const gridFontSize = 21

const bottomBorderSpecs = "1px solid black"
const topBorderSpecs = "2px solid black"
const topEdgeBorderSpecs = "4px solid black"

const startingAmount = 30000
const crossGain = 10000

const passMessage = `You passed the starting point again! Here's $${crossGain} for you!`

const Game = (props) => {

    const [playerCount, setPlayerCount] = useState(0)

    const [playersInfo, setPlayersInfo] = useState([])

    const [turnsElapsed, setTurnsElapsed] = useState(1)

    const [investments, changeInvestments] = useState(baseInvestmentInfo)

    const [availButtons, setAvailButtons] = useState({sell: true, buy: true, changeMarket: true, bank: true, capital: true, gamble: true, starting:true})

    const [availableInvestments, setAvailableInvestments] = useState(Object.values(baseInvestmentInfo).map(i => i.name))

    const [investmentInputState, setInvestmentInputState] = useState(baseInvestmentInfo["1"].name)

    const getActualPlayerNum = (pNum) => {
        if (pNum == 0) {
            return playerCount
        }
        return pNum
    }

    const sell = (e) => {
        let target;
        if (e.target.tagName === "SPAN") { 
            target = e.target.parentElement
        } else {
            target = e.target
        }
        const splitted = target.id.split("-")
        
        const playerInfo = {player: parseInt(splitted[0]), type: splitted[1]}
        let curPlayersInfo = playersInfo
        curPlayersInfo[playerInfo.player-1].cash += curPlayersInfo[playerInfo.player-1].investments[playerInfo.type]
        curPlayersInfo[playerInfo.player-1].investments[playerInfo.type] = 0
        
        let newAvailInvestments = []
        
        Object.values(investments).forEach(investment => {
            if (investment.value <= curPlayersInfo[playerInfo.player-1].cash) {
                newAvailInvestments.push(investment.name)
            }
        })
        
        setInvestmentInputState(newAvailInvestments.length > 0 ? newAvailInvestments[0] : "")
        setAvailableInvestments([...newAvailInvestments])

        let avail = availButtons
        avail.sell = false
        setPlayersInfo([...curPlayersInfo])
        setAvailButtons({...avail})
        
        
    }

    const onInvestmentChange = (event, values) => {
        setInvestmentInputState(values)
    }

    const buyInvestment = () => {
        const relInvestment = investments[investmentInfoToIds[investmentInputState]]
        const value = relInvestment.value
        const type = relInvestment.type

        const curPlayerNum = getActualPlayerNum(turnsElapsed%playerCount)
        const playerInfo = {player: curPlayerNum, type: type}
        let curPlayersInfo = playersInfo

        curPlayersInfo[playerInfo.player-1].cash -= value
        curPlayersInfo[playerInfo.player-1].investments[playerInfo.type] += value
        let avail = availButtons
        avail.buy = false
        setPlayersInfo([...curPlayersInfo])
        setAvailButtons({...avail})
    }

    const marketChange = () => {
        const investmentChanges = changes[document.getElementById("changeMarket").value]
        
        let curPlayersInfo = playersInfo
        
        for (let i = 0; i < playerCount; i++) {
            curPlayersInfo[i].investments.re = Math.round(curPlayersInfo[i].investments.re*investmentChanges[0], 2)
            curPlayersInfo[i].investments.it = Math.round(curPlayersInfo[i].investments.it*investmentChanges[1], 2)
            curPlayersInfo[i].investments.fx = Math.round(curPlayersInfo[i].investments.fx*investmentChanges[2], 2)
            curPlayersInfo[i].investments.cc = Math.round(curPlayersInfo[i].investments.cc*investmentChanges[3], 2)   
        }

        let avail = availButtons
        avail.changeMarket = false
        setPlayersInfo([...curPlayersInfo])
        setAvailButtons({...avail})
    }

    const bankInterest = () => {

        const curPlayerNum = getActualPlayerNum(turnsElapsed%playerCount)
        let curPlayersInfo = playersInfo
        
        curPlayersInfo[curPlayerNum - 1].cash = Math.round(curPlayersInfo[curPlayerNum-1].cash*1.05, 2)

        let avail = availButtons
        avail.bank = false
        setPlayersInfo([...curPlayersInfo])
        setAvailButtons({...avail})

        
    }

    const capitalGainsTax = () => {
        
        const curPlayerNum = getActualPlayerNum(turnsElapsed%playerCount)
        let curPlayersInfo = playersInfo
        
        curPlayersInfo[curPlayerNum-1].investments.re = Math.round(curPlayersInfo[curPlayerNum-1].investments.re*0.8, 2)
        curPlayersInfo[curPlayerNum-1].investments.it = Math.round(curPlayersInfo[curPlayerNum-1].investments.it*0.8, 2)
        curPlayersInfo[curPlayerNum-1].investments.fx = Math.round(curPlayersInfo[curPlayerNum-1].investments.fx*0.8, 2)
        curPlayersInfo[curPlayerNum-1].investments.cc = Math.round(curPlayersInfo[curPlayerNum-1].investments.cc*0.8, 2)   

        let avail = availButtons
        avail.capital = false
        setPlayersInfo([...curPlayersInfo])
        setAvailButtons({...avail})

    }

    const gamble = () => {
        const gambleValue = parseInt(document.getElementById("gambler").value)
        
        const curPlayerNum = getActualPlayerNum(turnsElapsed%playerCount)
        let curPlayersInfo = playersInfo

        if (gambleValue <= 3) {
            curPlayersInfo[curPlayerNum-1].cash = Math.round(curPlayersInfo[curPlayerNum-1].cash/2, 2)
        } else if (gambleValue == 4 || gambleValue == 5) {
            curPlayersInfo[curPlayerNum-1].cash = Math.round(curPlayersInfo[curPlayerNum-1].cash*1.1, 2)
        } else {
            curPlayersInfo[curPlayerNum-1].cash = Math.round(curPlayersInfo[curPlayerNum-1].cash*2, 2)
        }

        let avail = availButtons
        avail.gamble = false
        setPlayersInfo([...curPlayersInfo])
        setAvailButtons({...avail})
    }

    const addCash = () => {
       
        
        const curPlayerNum = getActualPlayerNum(turnsElapsed%playerCount)
        let curPlayersInfo = playersInfo

        curPlayersInfo[curPlayerNum-1].cash += crossGain

        let avail = availButtons
        avail.starting = false
        setPlayersInfo([...curPlayersInfo])
        setAvailButtons({...avail})

        let newAvailInvestments = []
        
        Object.values(investments).forEach(investment => {
            if (investment.value <= curPlayersInfo[curPlayerNum-1].cash) {
                newAvailInvestments.push(investment.name)
            }
        })
        
        setInvestmentInputState(newAvailInvestments.length > 0 ? newAvailInvestments[0] : "")
        setAvailableInvestments([...newAvailInvestments])
    }

    const nextTurn = () => {

        const newTurnsElapsed = turnsElapsed + 1

        setTurnsElapsed(newTurnsElapsed)

        const resetted = {sell: true, buy: true, changeMarket: true, bank: true, capital: true, gamble: true, starting:true}

        let newAvailInvestments = []
        
        Object.values(investments).forEach(investment => {
            if (investment.value <= playersInfo[getActualPlayerNum(newTurnsElapsed%playerCount) - 1].cash) {
                newAvailInvestments.push(investment.name)
            }
        })
        
        
        setInvestmentInputState(newAvailInvestments.length > 0 ? newAvailInvestments[0] : "")

        
        setAvailButtons({...resetted})
        setAvailableInvestments([...newAvailInvestments])
    }
    
    const add = (accumulator, a) => {
        return accumulator + a;
      }

    useEffect(() => {
        
        setPlayerCount(parseInt(localStorage.getItem("playerCount")))
        let pInfo = []
        
        for (let i = 0; i < parseInt(localStorage.getItem("playerCount")); i++) {
            pInfo.push({playerNum: pInfo.length + 1, cash: startingAmount, investments: {re: 0, it: 0, fx: 0, cc: 0}})
        }

        setPlayersInfo([...pInfo])

        let newAvailInvestments = []
        
        Object.values(investments).forEach(investment => {if (investment.value <= startingAmount) {newAvailInvestments.push(investment.name)}})
        
        
        setInvestmentInputState(newAvailInvestments[0])
        setAvailableInvestments([...newAvailInvestments])
    }, [])




    return (
        <div style={{width: "100vw", height: "100vh"}}>
    <Grid container style={{width: "calc(100% - 60px)", position: "relative", top: 30, left: 30}}>
        <Grid container item xs={2}>
            {labels.map((label) => {
                return <Grid key={label} item xs={12} style={{height: gridHeight, width: "100%", border: topBorderSpecs, alignContent: "center", borderLeft: topEdgeBorderSpecs, borderBottom: label == "Net Worth" ? topEdgeBorderSpecs: topBorderSpecs, borderTop: label == "Player" ? topEdgeBorderSpecs: topBorderSpecs}}>
                    <Typography style={{fontSize: 20, textAlign: "center"}}>{label}</Typography>
            </Grid>
            })}
        </Grid>
        <Grid container item xs={10}>
        {playersInfo.map((player) => {
            const num = player.playerNum
            const buttonStyle = {height: gridHeight+4, position: "absolute", backgroundColor: "transparent", right: -2, top: -4, fontSize: 18, color: "black", fontWeight: 500, border: topBorderSpecs, borderRadius: 0, borderLeft: topEdgeBorderSpecs}
            const onTurn = (turnsElapsed % playerCount == num) || (turnsElapsed % playerCount == 0 && num == playerCount)
            const textStyle = {fontSize: gridFontSize, textAlign: "center", fontWeight: onTurn ? 900: "normal"}

            
            return <>
            <Grid key={player.playerNum} container item xs={12/playerCount} style={{position: "relative", backgroundColor: onTurn ? "#eeeeee": "#ffffff"}}>
                <Grid item style={{height: gridHeight, width: "100%", border: topBorderSpecs, alignContent: "center", position: "absolute", borderTop: topEdgeBorderSpecs, borderRight: num == playerCount ? topEdgeBorderSpecs: topBorderSpecs}}>
                    <Typography style={textStyle}>{`Player ${num}`}</Typography>
                </Grid>
                <Grid item style={{height: gridHeight, width: "100%", border: topBorderSpecs, alignContent: "center", position: "absolute", top: gridHeight, borderRight: num == playerCount ? topEdgeBorderSpecs: topBorderSpecs}}>
                    <Typography style={textStyle}>{`$${Math.round(player.cash, 2)}`}</Typography>
                </Grid>
                <Grid item style={{height: gridHeight, width: "100%", border: topBorderSpecs, alignContent: "center", position: "absolute", top: 2*gridHeight, borderRight: num == playerCount ? topEdgeBorderSpecs: topBorderSpecs}}>
                    <Typography style={textStyle}>{`$${Math.round(player.investments.re, 2)}`}</Typography>
                    <Button onClick={sell} disabled={!onTurn || !availButtons.sell || player.investments.re <= 0} id={`${player.playerNum}-re`} style={buttonStyle}>Sell</Button>

                </Grid>
                <Grid item style={{height: gridHeight, width: "100%", border: topBorderSpecs, alignContent: "center", position: "absolute", top: 3*gridHeight, borderRight: num == playerCount ? topEdgeBorderSpecs: topBorderSpecs}}>
                    <Typography style={textStyle}>{`$${Math.round(player.investments.it, 2)}`}</Typography>
                    <Button onClick={sell} disabled={!onTurn || !availButtons.sell || player.investments.it <= 0} id={`${player.playerNum}-it`} style={buttonStyle}>Sell</Button>

                </Grid>
                <Grid item style={{height: gridHeight, width: "100%", border: topBorderSpecs, alignContent: "center", position: "absolute", top: 4*gridHeight, borderRight: num == playerCount ? topEdgeBorderSpecs: topBorderSpecs}}>
                    <Typography style={textStyle}>{`$${Math.round(player.investments.fx, 2)}`}</Typography>
                    <Button onClick={sell} disabled={!onTurn || !availButtons.sell || player.investments.fx <= 0} id={`${player.playerNum}-fx`} style={buttonStyle}>Sell</Button>

                </Grid>
                <Grid item style={{height: gridHeight, width: "100%", border: topBorderSpecs, alignContent: "center", position: "absolute", top: 5*gridHeight, borderRight: num == playerCount ? topEdgeBorderSpecs: topBorderSpecs}}>
                    <Typography style={textStyle}>{`$${Math.round(player.investments.cc, 2)}`}</Typography>
                    <Button onClick={sell} disabled={!onTurn || !availButtons.sell || player.investments.cc <= 0} id={`${player.playerNum}-cc`} style={buttonStyle}>Sell</Button>

                </Grid>
                <Grid item style={{height: gridHeight, width: "100%", border: topBorderSpecs, alignContent: "center", position: "absolute", top: 6*gridHeight, borderBottom: topEdgeBorderSpecs, borderRight: player.playerNum == playerCount ? topEdgeBorderSpecs: topBorderSpecs}}>
                    <Typography style={textStyle}>{`$${player.cash+Object.values(player.investments).reduce(add, 0)}`}</Typography>
                </Grid>
            </Grid>
                
            </>
        })
        }   
        </Grid>
    </Grid>

    <Grid container style={{width: "calc(100% - 60px)", height: 300, left: 30, position: "absolute", backgroundColor: "lightgray", bottom: 50}}>
        <Grid item xs={4} style={{height: "50%", position: "relative", border: bottomBorderSpecs}}>
            <Autocomplete id="investmentInput" options={availableInvestments} onChange={onInvestmentChange} value={investmentInputState} style={{width: "calc(100% - 150px)", position: "relative", left: 25, top: "calc(50% - 17px)", backgroundColor: "white", fontSize: 20, height: 34}} renderInput={(params) => <TextField placeholder={" Select an investment"} style={{position: "relative", top: 3}} {...params}/>}/>
            <Button disabled={!availButtons.buy} onClick={buyInvestment} id="buyButton" style={{backgroundColor: availButtons.buy ? "#42eb6f" : "#f77b72", position: "absolute", right: 25, top: "calc(50% - 17px)", color: "white", textTransform: "initial", fontSize: 17, height: 34}}>Buy!</Button>
        </Grid>
        <Grid item xs={4} style={{height: "50%", position: "relative", border: bottomBorderSpecs, borderLeft: "0px"}}>
            <Autocomplete id="changeMarket" options={Object.keys(changes)} defaultValue={"1"} style={{width: "calc(100% - 150px)", position: "relative", left: 25, top: "calc(50% - 17px)", backgroundColor: "white", fontSize: 20, height: 34}} renderInput={(params) => <TextField placeholder={" Select a market update"} style={{position: "relative", top: 3}} {...params}/>}/>
            <Button disabled={!availButtons.changeMarket} onClick={marketChange} id="changeMarketButton" style={{backgroundColor: availButtons.changeMarket ? "#42eb6f" : "#f77b72", position: "absolute", right: 25, top: "calc(50% - 17px)", color: "white", textTransform: "initial", fontSize: 17, height: 34}}>
                <Check style={{ color: "white", fontSize: 25 }} />
            </Button>
        </Grid>
        <Grid item xs={2} style={{height: "50%", position: "relative", border: bottomBorderSpecs, borderLeft: "0px"}}>
        <Button disabled={!availButtons.bank} onClick={bankInterest} style={{backgroundColor: availButtons.bank ? "#42eb6f" : "#f77b72", position: "absolute", left: "calc(50% - 61.24px)", top: "calc(50% - 25px)", color: "white", textTransform: "initial", fontSize: 17, height: 50}}>Bank Interest</Button>
        </Grid>
        <Grid item xs={2} style={{height: "50%", position: "relative", border: bottomBorderSpecs, borderLeft: "0px"}}>
        <Button disabled={!availButtons.capital} onClick={capitalGainsTax} style={{backgroundColor: availButtons.capital ? "#42eb6f" : "#f77b72", position: "absolute", left: "calc(50% - 78.25px)", top: "calc(50% - 25px)", color: "white", textTransform: "initial", fontSize: 17, height: 50}}>Capital Gains Tax</Button>
        </Grid>
        <Grid item xs={4} style={{height: "50%", position: "relative", border: bottomBorderSpecs, borderTop: "0px"}}>
            <Autocomplete id="gambler" options={["1","2","3","4","5","6"]} defaultValue={"1"} style={{width: "calc(100% - 170px)", position: "relative", left: 25, top: "calc(50% - 17px)", backgroundColor: "white", fontSize: 20, height: 34}} renderInput={(params) => <TextField placeholder={" # between 1-12"} style={{position: "relative", top: 3}} {...params}/>}/>
            <Button disabled={!availButtons.gamble} onClick={gamble} style={{backgroundColor: availButtons.gamble ? "#42eb6f" : "#f77b72", position: "absolute", right:25, top: "calc(50% - 17px)", color: "white", textTransform: "initial", fontSize: 17, height: 34}}>
                Gamble!
            </Button>
        </Grid>
        <Grid item xs={4} style={{height: "50%", position: "relative", borderBottom: bottomBorderSpecs, borderRight: bottomBorderSpecs}}>
            <Button disabled={!availButtons.starting} onClick={addCash} style={{backgroundColor: availButtons.starting ? "#42eb6f" : "#f77b72", position: "absolute", left:40, right: 40, height: 80, top: "calc(50% - 40px)", color: "white", textTransform: "initial", fontSize: 20}}>
                {passMessage}
            </Button>
        </Grid>
        <Grid item xs={4} style={{height: "50%", position: "relative", borderBottom: bottomBorderSpecs, borderRight: bottomBorderSpecs}}>
            <Button onClick={nextTurn} style={{backgroundColor: "#42eb6f", position: "absolute", left:40, right: 40, height: 80, top: "calc(50% - 40px)", color: "white", textTransform: "initial", fontSize: 40, fontWeight: 400}}>
                NEXT →
            </Button>
        </Grid>
        

        
        
    </Grid>


    
    </div>)
}

export default Game