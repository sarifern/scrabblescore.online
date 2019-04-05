import React from 'react';
import GameSettings from './GameSettings.js';
import ScrabbleInputBox from './ScrabbleInputBox.js';
import Game from './game.js';
import {scrabbleScore} from './Util.js';
import ScoreGrid from './ScoreGrid.js';

const debug = false;

class ScoreKeeper extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleAddWord = this.handleAddWord.bind(this);
    this.handleEndTurn = this.handleEndTurn.bind(this);
    this.handleBingo = this.handleBingo.bind(this);

    this.state = {
      /* DONE language should not be in state */
      game: Game.createNewGame(this.props.playerNames.length),
      /* TODO {value: '', modifiers: [], score: 0} should be a constant emptyWord or something */
      currentWord: {value: '', modifiers: [], score: 0},
      games: []
    }
  }

   _setGame(game) {
    /* DONE Rewrite with the [... ] notation */
    let newGames = [...this.state.games.slice(), this.state.game]
    this.setState({games: newGames, game: game})
  }

  _resetCurrentWord() {
    this.setState({currentWord: {value: '', modifiers: [], score: 0}})
  }

  handleChange(word) {
    word = {...word, score: scrabbleScore(word.value, word.modifiers, this.props.language)}
    this.setState({currentWord: word});
  }

  handleEndTurn() {
    /* DONE fix indentation */
    let game = this.state.game;
    if (this.state.currentWord.value.length !== 0) {
      game = game.addWord(this.state.currentWord)
    }
    this._setGame(game.endTurn())
    this._resetCurrentWord()
  }

  handleUndo() {
    if (this.state.games.length === 0)
      return;

    let games = this.state.games.slice(0, -1)
    let game = this.state.games[this.state.games.length - 1]
    this.setState({game: game, games: games});
    this._resetCurrentWord()
  }

  handleAddWord() {
    this._setGame(this.state.game.addWord(this.state.currentWord))
    this._resetCurrentWord()
  }

  handleBingo() {
    this._setGame(this.state.game.setBingo(!this.state.game.getCurrentTurn().bingo));
  }

  render() {
    return (
      <div className='score-keeper'>
        <br />
        <ScoreGrid playerNames={this.props.playerNames} game={this.state.game} language={this.props.language}/>
        <div>
          <p className="bold">{this.props.playerNames[this.state.game.currentPlayerIndex]}, submit a word:</p>
          <ScrabbleInputBox onChange={this.handleChange} word={this.state.currentWord} language={this.props.language}/>
          <CurrentScore score={this.state.currentWord.score}/>
          <button onClick={this.handleUndo}type="submit" className="btn btn-info word-submit-button" disabled={this.state.games.length === 0}>UNDO</button>
          <button onClick={this.handleAddWord}type="submit" className="btn btn-info word-submit-button" disabled={this.state.currentWord.value === ''}>+ ADD A WORD</button>
          <button onClick={this.handleEndTurn}type="submit" className="btn btn-info word-submit-button">END TURN</button>
          <div className="custom-control custom-switch">
            <input onChange={this.handleBingo} type="checkbox" className="custom-control-input" id="bingoToggle" checked={this.state.game.getCurrentTurn().bingo}/>
            <label className="custom-control-label" htmlFor="bingoToggle">BINGO</label>
          </div>
        </div>
      </div>
    )
  }
}

class CurrentScore extends React.Component {
  render() {
    return(
      <div id="score" className="card-header">
        Score is {this.props.score}
      </div>
    )
  }
}

class ScrabbleScoreKeeper extends React.Component {
  state = debug ? {
    playerNames: ['Anna', 'Nico'],
    language: 'en'
  } :
  {
    playerNames: [],
    language: ''
  }

  handleGameStart(playerNames, language) {
    this.setState({playerNames: playerNames, language: language});
  }
  renderGame() {
    /* TODO rename the callback name to onXXX */
    return this.state.playerNames.length === 0 ? 
      <GameSettings setGame={this.handleGameStart.bind(this)} /> :
      <ScoreKeeper playerNames={this.state.playerNames} language={this.state.language} />;
  }

  render() {
    return (
      <div className='main'>
        <h1> Scrabble score keeper</h1>
        {this.renderGame()}
      </div>
    );
  }
}

export default ScrabbleScoreKeeper;

/*
X In ScrabbleInputBox, filter out letters that are on the scorelist, instead of doing isLetter().
*/