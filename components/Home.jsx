import { Typography, Select, MenuItem, FormControl, Grid, Button } from "@material-ui/core"
import Link from "next/link"

const HomePage = (props) => {

    const onPlayerCountChange = (e) => {
        // console.log(document.getElementById("playerCountSelect").parentElement.children[1].value)
        localStorage.setItem("playerCount", document.getElementById("playerCountSelect").value)
    }

    return (<div style={{width: '100vw', height: '100vh', backgroundColor: "#f4f4f4"}}>
        <Typography style={{fontSize: 60, textAlign: 'center', width: '100%', position: 'relative', top: 100}}>Welcome to Capital Expedition!</Typography>
        <Grid style={{position: 'relative'}} container>
            <Grid item>
                <Typography style={{fontSize: 30, textAlign: 'center', position: 'relative', top: 130, left: "calc(50vw - 230.725px)"}}>How many players are there?</Typography>
            </Grid>
        <Grid item>
        <select id="playerCountSelect" onChange={onPlayerCountChange} defaultValue={2} style={{position: 'absolute', top: 130, height: 45, width: 60, right: 400, backgroundColor: "#ffffff", fontSize: 18, border: "2px solid black", borderRadius: 3, textAlign: "center"}}>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                </select>
        </Grid>
        </Grid>
        <Link href="/game">
        <Button onClick={onPlayerCountChange} style={{width: 150, height: 60, textTransform: "initial", backgroundColor: "#42eb6f", position: "relative", left: "calc(50% - 75px)", top: 180, color: "white", fontSize: 25}}>Play!</Button>
        </Link>
        </div>)
    }

export default HomePage