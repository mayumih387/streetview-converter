import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

const IndexPage = () => {
  const [enteredApi, setEnteredApi] = useState("")
  const [enteredCode, setEnteredCode] = useState("")
  const [convertedCode, setConvertedCode] = useState("")
  const [displayConvertedCode, setDisplayConvertedCode] = useState("")
  const [errorApikey, setErrorApikey] = useState(false)
  const [errorTextarea1, setErrorTextarea1] = useState(false)
  const [copyText, setCopyText] = useState("Click textarea to copy")

  const convertCode = (text, api) => {
    if (text.trim().length > 0) {
      const regex =
        /<iframe .+!1s(.+)!.+!1d(-?[\d.]+)!2d(-?[\d.]+)!3f(-?[\d.]+)!4f(-?[\d.]+)!5f(-?[\d.]+).+<\/iframe>/
      setConvertedCode(
        text.replace(regex, (match, p1, p2, p3, p4, p5, p6) => {
          const fov = 40 / parseFloat(p6)
          return `<iframe src="https://www.google.com/maps/embed/v1/streetview?location=${p2}%2C${p3}&pano=${p1}&heading=${p4}&pitch=${p5}&fov=${fov}&key=${api}" width="600" height="450" style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`
        })
      )
      const element = document.getElementById("Textarea2")
      element.addEventListener("click", copyToClipboard)
    } else {
      setConvertedCode("")
    }
  }

  const apiKeyRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/

  const iframeRegex =
    /<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=!.+<\/iframe>/

  //Copy to Clipboard
  const copyToClipboard = async () => {
    if (displayConvertedCode.trim().length > 0) {
      await global.navigator.clipboard.writeText(displayConvertedCode)
      setCopyText("Copied!")
    } else {
      return
    }
  }

  const apiInputHandler = event => {
    setEnteredApi(event.target.value)
    setCopyText("Click textarea to copy")
    if (apiKeyRegex.test(event.target.value)) {
      setErrorApikey(false)
      convertCode(enteredCode, event.target.value)
    } else {
      setErrorApikey(true)
    }
  }
  const apiPasteHandler = event => {
    event.preventDefault()
    setEnteredApi(event.clipboardData.getData("text"))
    setCopyText("Click textarea to copy")
    if (apiKeyRegex.test(event.clipboardData.getData("text"))) {
      setErrorApikey(false)
      convertCode(enteredCode, event.clipboardData.getData("text"))
    } else {
      setErrorApikey(true)
    }
  }

  const codeInputHandler = event => {
    const inputValue = event.target.value
    setEnteredCode(inputValue)
    setCopyText("Click textarea to copy")
    if (iframeRegex.test(inputValue)) {
      convertCode(inputValue, enteredApi)
      setErrorTextarea1(false)
    } else {
      setErrorTextarea1(true)
    }
  }
  const pasteInputHandler = event => {
    event.preventDefault()
    const pastedValue = (event.clipboardData || window.Clipboard).getData(
      "text"
    )
    setEnteredCode(pastedValue)
    setCopyText("Click textarea to copy")
    if (iframeRegex.test(pastedValue)) {
      convertCode(pastedValue, enteredApi)
      setErrorTextarea1(false)
    } else {
      setErrorTextarea1(true)
    }
  }

  useEffect(() => {
    setDisplayConvertedCode(convertedCode)
  }, [enteredCode, convertedCode, enteredApi])

  const resetHandler = () => {
    setEnteredCode("")
    setConvertedCode("")
    setErrorTextarea1(false)
    setCopyText("Click textarea to copy")
  }

  return (
    <Layout>
      <p>
        Convert regular street view iframe embed code to Google Maps Embed API
        format
      </p>
      <form onSubmit={event => event.preventDefault()} className={styles.form}>
        <div className={styles.formControl}>
          <label htmlFor="Input1" className={styles.label}>
            Your API
          </label>
          <input
            type="text"
            id="Input1"
            value={enteredApi}
            onChange={apiInputHandler}
            onPaste={apiPasteHandler}
          />
          {errorApikey && <p style={{ color: "red" }}>Invalid API key</p>}
        </div>
        <div className={styles.formControl}>
          <label htmlFor="Textarea1" className={styles.label}>
            Input regular code
          </label>{" "}
          <button onClick={resetHandler}>Clear</button>
          <textarea
            id="Textarea1"
            rows="5"
            onChange={codeInputHandler}
            onPaste={pasteInputHandler}
            value={enteredCode}
          />
          {errorTextarea1 && <p style={{ color: "red" }}>Invalid code</p>}
        </div>
      </form>
      <hr />

      <div className={styles.formControl}>
        <label htmlFor="Textarea2" className={styles.label}>
          Result
        </label>{" "}
        {copyText}
        <textarea
          id="Textarea2"
          rows={5}
          value={displayConvertedCode}
          readOnly
          onClick={copyToClipboard}
        />
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Streetview Maps Embed API converter" />

export default IndexPage
