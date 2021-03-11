import React, {ChangeEvent, useState} from 'react';
import {utils} from 'ethers'

const base58check =  require('base58check');
const NEWID_PREFIX = "NEWID"
const NEW_PREFIX = "NEW"
const CHAIN_ID_DEV = 1002
const CHAIN_ID_TEST = 1007
const CHAIN_ID_MAIN = 1012

function Index() {

    const [newIdInputInfo, setNewIdInputInfo] = useState("")
    const [hash, setHash] = useState("")


    function handleNewIdInputChange(e: ChangeEvent<HTMLInputElement>) {
        setNewIdInputInfo(e.target.value)
    }

    function handleConfirmConvert() {
        if(newIdInputInfo == null) {
            return
        }
        if(!newIdInputInfo.startsWith(NEWID_PREFIX)) {
            return;
        }
        const data = newIdInputInfo.slice(5)
        const decodeData = base58check.decode(data)
        setHash('0x' + decodeData.data.toString('hex').slice(4))
    }


    const [newAddressInput, setNewAddressInput] = useState("")
    const [convertedHexAddress, setConvertedHexAddress] = useState("")
    const [convertedCheckSumAddress, setConvertedCheckSumAddress] = useState("")

    function handleNewAddressChange(e: ChangeEvent<HTMLInputElement>) {
        setNewAddressInput(e.target.value)
    }

    function handleNewAddressToHex() {
        if(newAddressInput == null) {
            return
        }
        if(!newAddressInput.startsWith(NEW_PREFIX)) {
            return;
        }
        const hex = "0x" + base58check.decode(newAddressInput.slice(3), "hex").data.slice(4);
        setConvertedHexAddress(hex)
        setConvertedCheckSumAddress(utils.getAddress(hex))
    }

    const [hexAddressInput, setHexAddressInput] = useState("")
    const [convertedMainNewAddress, setConvertedMainNewAddress] = useState("")
    const [convertedTestNewAddress, setConvertedTestNewAddress] = useState("")
    const [convertedDevNewAddress, setConvertedDevNewAddress] = useState("")

    function handleHexAddressChange(e: ChangeEvent<HTMLInputElement>) {
        setHexAddressInput(e.target.value)
    }

    function handleHexAddressToNewAddress() {
        if(hexAddressInput == null) {
            return
        }
        if(hexAddressInput.startsWith(NEW_PREFIX)) {
            return;
        }
        if(utils.isAddress(hexAddressInput)) {
            return;
        }
        let address: string
        if(hexAddressInput.startsWith('0x')) {
            address = hexAddressInput.slice(2)
        } else {
            address = hexAddressInput
        }
        let mainData = parseAddressInfo(CHAIN_ID_MAIN, address)
        const testData = parseAddressInfo(CHAIN_ID_TEST, address)
        const devData = parseAddressInfo(CHAIN_ID_DEV, address)
        setConvertedMainNewAddress(NEW_PREFIX + base58check.encode(mainData))
        setConvertedTestNewAddress(NEW_PREFIX + base58check.encode(testData))
        setConvertedDevNewAddress(NEW_PREFIX + base58check.encode(devData))
    }

    function parseAddressInfo(chainId: number, address: string) {
        let data = chainId.toString(16).slice(-8) + address
        if (data.length % 2 != 0) {
            data = '0' + data
        }
        return data
    }

    return (
        <div>
            <h1>NewId Convert</h1>
            <div>
                NEWid: <input style={{width: "80%"}} placeholder="Input NewID" onChange={handleNewIdInputChange}/>
            </div>
            <div>
                NEWHash: <input style={{width: "80%"}} placeholder="Hash" value={hash} readOnly={true}/>
            </div>
            <button onClick={handleConfirmConvert}>确认</button>

            { /*Convert NewAddress to Hex Address */ }
            <h1>Convert NewAddress to Hex Address</h1>
            <div>
                NewAddress: <input style={{width: "80%"}} placeholder="Input New Address" onChange={handleNewAddressChange}/>
            </div>
            <div>
                HexAddress: <input style={{width: "80%"}} placeholder="HexAddress" value={convertedHexAddress} readOnly={true}/>
            </div>
            <div>
                CheckSum HexAddress: <input style={{width: "80%"}} placeholder="CheckSum HexAddress" value={convertedCheckSumAddress} readOnly={true}/>
            </div>
            <button onClick={handleNewAddressToHex}>确认</button>

            { /*Convert Hex Address to NewAddress */ }
            <h1>Convert Hex Address to NewAddress</h1>
            <div>
                HexAddress: <input style={{width: "80%"}} placeholder="Input New Address" onChange={handleHexAddressChange}/>
            </div>
            <div>
                MainNet NewAddress: <input style={{width: "80%"}} placeholder="Main NewAddress" value={convertedMainNewAddress} readOnly={true}/>
            </div>
            <div>
                TestNet NewAddress: <input style={{width: "80%"}} placeholder="Test NewAddress" value={convertedTestNewAddress} readOnly={true}/>
            </div>
            <div>
                DevNet NewAddress: <input style={{width: "80%"}} placeholder="Dev NewAddress" value={convertedDevNewAddress} readOnly={true}/>
            </div>
            <button onClick={handleHexAddressToNewAddress}>确认</button>

        </div>
    );
}

export default Index;
