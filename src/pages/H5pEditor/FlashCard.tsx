import { Button, IconButton, InputBase, makeStyles } from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

const useStyle = makeStyles((theme) => ({
  container: {
    backgroundColor: "#27344e",
    [theme.breakpoints.up("md")]: {
      width: "80%",
      // height: '60%',
      height: "700px",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      paddingBottom: 105,
    },
    [theme.breakpoints.down("md")]: {
      overflow: "hidden",
      paddingBottom: 105,
      width: "100%",
      transform: "translate(0, 0)",
      position: "static",
    },
  },
  title: {
    borderBottom: "1px solid #474e61",
    color: "#fff",
    height: 100,
    textAlign: "center",
    fontSize: 26,
    lineHeight: "100px",
  },
  cardItem: {
    width: "350px",
    height: "410px",
    marginRight: "60px",
    backgroundColor: "#fff",
    borderRadius: 20,
    transition: "1s",
    padding: 20,
    boxSizing: "border-box",
    position: "relative",
  },
  itemBox: {
    // width: 500 * fakeArr.length,
    width: (query: any) => 500 * query.fakeArr.length,
    // height: '100%',
    display: "flex",
    marginLeft: (query: any) => query.currentPosition,
    // opacity: 0.75,
    marginTop: "50px",
    transition: "0.5s",
  },
  currnetItem: {
    // opacity: 1,
    transform: "scale(1.1)",
    transformOrigin: "50% 50%",
  },
  buttons: {
    margin: "20px 0",
    position: "relative",
  },
  leftButton: {
    color: "#a3adc4",
    backgroundColor: "transparent",
    border: "1px solid #414d66",
    "&:hover": {
      backgroundColor: "#414d66",
    },
    position: "absolute",
    left: 30,
    top: "38px",
    // transform: 'translateY(-50%)'
  },
  rightButton: {
    color: "#a3adc4",
    backgroundColor: "transparent",
    border: "1px solid #414d66",
    "&:hover": {
      backgroundColor: "#414d66",
    },
    position: "absolute",
    right: 30,
    top: "38px",
  },
  imagePart: {
    width: "100%",
    height: "70%",
    backgroundColor: "#c8e0e3",
    borderRadius: "20px 20px 0 0",
  },
  questionPart: {
    textAlign: "center",
    fontSize: "24px",
    color: "#27344e",
    fontWeight: 300,
  },
  answer: {
    display: "flex",
    padding: "0 10px",
    alignItems: "center",
    position: "relative",
  },
  input: {
    width: "100%",
    height: 45,
    padding: "0 20px",
    border: "1px solid #7fb8ff",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  check: {
    position: "absolute",
    right: 10,
    height: "100%",
    borderRadius: "0 20px 20px 0",
    backgroundColor: "#7fb8ff",
    padding: "0 20px",
    lineHeight: "42px",
    color: "#fff",
    // cursor: "pointer",
    "&:hover": {
      backgroundColor: "#72c1e6",
    },
  },
  number: {
    margin: "15px 0",
  },
  count: {
    textAlign: "center",
    color: "#fff",
    fontSize: "20px",
  },
  showResult: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  resultItem: {
    backgroundColor: "transparent",
  },
  topPart: {
    display: "flex",
    justifyContent: "space-between",
  },
  answerList: {
    width: "100%",
    height: "100%",
    padding: 100,
    boxSizing: "border-box",
    fontSize: 30,
    color: "#fff",
    overflowY: "auto",
  },
  answerListItemContainer: {
    marginTop: 50,
  },
  answerListItem: {
    width: "100%",
    height: 90,
    border: "1px solid #414d66",
    borderRadius: 20,
    padding: 10,
    boxSizing: "border-box",
    display: "flex",
    position: "relative",
  },
  leftImage: {
    height: 70,
    width: 85,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  middleIntro: {
    fontSize: 16,
    marginLeft: 40,
  },
  rightSignal: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 60,
    height: 70,
    borderRadius: "0 20px 20px 0",
    backgroundColor: "red",
  },
}));

interface FlashCardProps {
  px?: number;
  value?: any;
}

interface Answers {
  text: string;
  status: string;
}

export function FlashCard(props: FlashCardProps) {
  const { px = 1 } = props;
  const fakeArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  const [answers, setAnswers] = React.useState<Answers[]>([{ text: "", status: "unknown" }]);

  const [showList, setShowList] = React.useState("answers");

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentPosition, setCurrentPosition] = React.useState(250);
  const query = {
    px,
    fakeArr,
    currentPosition,
  };

  const css = useStyle(query);

  React.useEffect(() => {
    const arr = fakeArr.map(() => ({ text: "", status: "unknown" }));
    setAnswers(arr);
  }, [fakeArr]);

  React.useEffect(() => {
    let container = document.getElementById("container");
    if (container) {
      setCurrentPosition(container.clientWidth / 2 - 350 / 2);
    }
  }, []);

  const handleClick = (index: number) => {
    setCurrentIndex(index);
    if (index > currentIndex) {
      setCurrentPosition(currentPosition - (350 + 60));
    }
    if (index < currentIndex) {
      setCurrentPosition(currentPosition + (350 + 60));
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex - 1);
    setCurrentPosition(currentPosition + (350 + 60));
  };

  const handleNextClick = () => {
    setCurrentIndex(currentIndex + 1);
    setCurrentPosition(currentPosition - (350 + 60));
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    if (!e.target.value) return;
    let arr = JSON.parse(JSON.stringify(answers));
    arr[index].text = e.target.value;
    answers[index].text = e.target.value;
    setAnswers(answers);
  };

  const handleCheckAnswer = (index: number) => {
    if (!answers[index].text) return;
    if (answers[index].text === fakeArr[index]) {
      let arr = JSON.parse(JSON.stringify(answers));
      arr[index].status = "correct";
      setAnswers(arr);
    } else {
      let arr = JSON.parse(JSON.stringify(answers));
      arr[index].status = "wrong";
      setAnswers(arr);
    }
  };

  const getColor = (index: number) => {
    return answers[index] && answers[index].status === "correct"
      ? "#6cda4a"
      : answers[index] && answers[index].status === "wrong"
      ? "#f30e0e"
      : "#c8e0e3nage";
  };

  const handleShowResult = () => {
    setShowList("answers");
  };

  return (
    <div className={css.container} id="container">
      {showList === "questions" && (
        <>
          <div className={css.title}>flash card</div>
          <p className={css.count}>
            {currentIndex + 1} / {fakeArr.length}
          </p>
          <div className={css.itemBox}>
            {fakeArr.map((item, index) => (
              <div
                style={{ opacity: currentIndex === index ? 1 : 0.55 }}
                key={item}
                className={clsx(css.cardItem, currentIndex === index ? css.currnetItem : "")}
                onClick={() => handleClick(index)}
              >
                <div className={clsx(css.imagePart, "imagePart")} style={{ backgroundColor: getColor(index) }}></div>
                <div className={css.questionPart}>
                  <p className={css.number}>Q{index + 1}</p>
                </div>
                <div className={css.answer}>
                  <InputBase
                    disabled={answers[index] && answers[index].status !== "unknown"}
                    placeholder="Your answer"
                    onChange={(e) => handleAnswerChange(e, index)}
                    className={css.input}
                  />
                  {answers[index] && answers[index].status === "unknown" && (
                    <Button className={css.check} onClick={() => handleCheckAnswer(index)}>
                      Check
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className={clsx(css.cardItem, css.resultItem)}>
              <div className={css.showResult} onClick={handleShowResult}>
                show result
              </div>
            </div>
          </div>
          <div className={css.buttons}>
            {currentIndex !== 0 && (
              <IconButton className={css.leftButton} onClick={handlePrevClick}>
                <ArrowBack />
              </IconButton>
            )}
            {currentIndex < fakeArr.length - 1 && (
              <IconButton className={css.rightButton} onClick={handleNextClick}>
                <ArrowForward />
              </IconButton>
            )}
          </div>
        </>
      )}
      {showList === "answers" && (
        <div className={css.answerList}>
          <div className={css.topPart}>
            <div>Results</div>
            <div>1 of 2 correct</div>
          </div>
          <div className={css.answerListItemContainer}></div>
          {answers.map((item, index) => (
            <div className={css.answerListItem}>
              <div className={css.leftImage}></div>
              <div className={css.middleIntro}>
                <div style={{ marginTop: "10px" }}>Q1</div>
                <div style={{ marginTop: "10px" }}>A: s Correct answer: a1</div>
              </div>
              <div className={css.rightSignal}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
