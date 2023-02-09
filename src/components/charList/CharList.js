import PropTypes from "prop-types";
import React, { Component } from "react";

import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./charList.scss";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelService();

  onCharsError = () => {
    this.setState({ loading: false, error: true });
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharsLoaded)
      .catch(this.onCharsError);
  };

  onCharListLoading = () => {
    this.setState({ newItemLoading: true });
  };

  onCharsLoaded = (newChars) => {
    let ended = false;

    if (newChars.length < 9) {
      ended = true;
    }

    this.setState(({ chars, offset }) => ({
      chars: [...chars, ...newChars],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  charRefs = [];

  setCharRef = (ref) => {
    this.charRefs.push(ref);
  };

  focusOnItem = (id) => {
    this.charRefs.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    this.charRefs[id].classList.add("char__item_selected");
    this.charRefs[id].focus();
  };

  renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          tabIndex={0}
          ref={this.setCharRef}
          className={"char__item"}
          key={item.id}
          onClick={() => {
            this.props.onCharSelected(item.id);
            this.focusOnItem(i);
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  }
  render() {
    const { chars, loading, error, newItemLoading, offset, charEnded } =
      this.state;
    const items = this.renderItems(chars);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={charEnded ? { display: "none" } : null}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
