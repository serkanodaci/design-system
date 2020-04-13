import GitHubLinks from './GitHubLinks';
import React from 'react';
import UsaBanner from './UsaBanner';
import path from 'path';

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { isBannerOpen: false };
    this.handleToggleBanner = this.handleToggleBanner.bind(this);
  }

  handleToggleBanner() {
    this.setState({ isBannerOpen: !this.state.isBannerOpen });
  }

  render() {
    return (
      <div>
        <UsaBanner
          isBannerOpen={this.state.isBannerOpen}
          onToggleBanner={this.handleToggleBanner}
        />
        <header className="ds-base--inverse ds-u-padding--3 ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
          <h1 className="ds-h3 ds-u-margin-bottom--0">
            <a
              href={path.join('/', process.env.rootPath)}
              className="ds-c-link--inverse c-header__title"
              title="Home"
            >
              {process.env.name}
            </a>
          </h1>
          <GitHubLinks className="ds-u-display--none ds-u-sm-display--block" inversed />
        </header>
      </div>
    );
  }
}

export default Header;
