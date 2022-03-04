import React from "react";
import { Box, render } from "ink";

import type { GithubOptions } from "src/types";

import { Input } from "./Input.js";
import { Confirm } from "./Confirm.js";
import { Choice, Select } from "./Select.js";
import { Github } from "./Github.js";

export type InputOptions = {
  message: string;
  hint?: string;
  defaultValue?: string;
};

export type ConfirmOptions = {
  message: string;
  defaultValue?: boolean;
};

export type SelectOptions<TChoice> = {
  choices: Choice<TChoice>[];
  message: string;
  hint?: string;
};

export class Prompt {
  /**
   * Ink render instance.
   */
  private app = render(<Box />);

  /**
   * Close the prompt session.
   */
  public close() {
    this.app.clear();
    this.app.unmount();
  }

  /**
   * Ask a question to the user.
   *
   * @example
   * const name = await prompt.input("What’s your name?")
   */
  public input(message: string): Promise<string>;
  public input(options: InputOptions): Promise<string>;
  public input(options: InputOptions | string): Promise<string> {
    const props = typeof options === "string" ? { message: options } : options;

    return new Promise<string>((resolve) => {
      this.app.rerender(<Input {...props} onSubmit={resolve} />);
    });
  }

  /**
   * Show a list of options to the user.
   *
   * @example
   * const gender = await prompt.select({
   *   choices: [
   *    { label: "Male", value: "m" as const },
   *    { label: "Female", value: "f" as const }
   *   ],
   *   message: "What’s your gender?"
   * })
   */
  public select<TChoice>(props: SelectOptions<TChoice>): Promise<TChoice> {
    return new Promise<TChoice>((resolve) => {
      this.app.rerender(<Select {...props} onSubmit={resolve} />);
    });
  }

  /**
   * Ask a question with yes or no expected answer.
   *
   * @example
   * const withSauce = await prompt.confirm("Do you want sauce?")
   */
  public confirm(message: string): Promise<boolean>;
  public confirm(options: ConfirmOptions): Promise<boolean>;
  public confirm(options: ConfirmOptions | string): Promise<boolean> {
    const props = typeof options === "string" ? { message: options } : options;

    return new Promise<boolean>((resolve) => {
      this.app.rerender(<Confirm {...props} onSubmit={resolve} />);
    });
  }

  /**
   * Smart prompt for selecting a github file.
   */
  public github(): Promise<GithubOptions> {
    return new Promise<GithubOptions>((resolve) => {
      this.app.rerender(<Github onSubmit={resolve} />);
    });
  }
}
