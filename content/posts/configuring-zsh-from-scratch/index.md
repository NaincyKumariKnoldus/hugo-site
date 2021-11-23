---
title: "Configuring Zsh From Scratch"
desc: "Configuring my shell without using any framework"
date: 2021-09-28T18:14:46+01:00
author: "Druskus"
categories: ["zsh", "shell"]
draft: false
private: false
---


![My zsh](images/showcase-0.png)

I recently decided to reconfigure my Zsh from scratch in to try some new plugins. My old config was relatively simple, though It was getting somewhat messy. On top of this, I also wanted to try to set up Vi Mode properly and actually play around with the keybinds.

### The Zsh Dotfiles
As described in [Zsh's docs](https://zsh.sourceforge.io/Intro/intro_3.html), Zsh looks for files in `$ZDOTDIR` if defined. In order to keep my home directory clean, I decided to set this variable system-wide, in `/etc/zsh/zshenv`.

```zsh
ZDOTDIR="$HOME/.config/zsh"
```

Zsh is said to use the following files: 

```zsh
# Sourced on all invocations of the shell
$ZDOTDIR/.zshenv 

# Sourced in interactive shells
$ZDOTDIR/.zshrc

# Sourced in login shells, before .zshrc
$ZDOTDIR/.zprofile

# Sourced in login shells, after .zshrc
$ZDOTDIR/.zlogin

# Sourced when the shell exits
$ZDOTDIR/.zlogout
```

### .zprofile
`.zprofile` contains my environment variables. First of all I specify my preferred programs and settings: 


```zsh
export EDITOR=/usr/bin/nvim
export BROWSER=/bin/google-chrome-stable
export MONITOR="HDMI-0"
export TERMINAL="/bin/alacritty"
```

I also append the path for my local binaries and scripts to the `PATH` variable.
```zsh
export PATH="$HOME"/.local/bin:"$HOME"/.local/bin/scripts:"$HOME"/.local/share/npm/bin:"$PATH"
```

The rest of the file is filled with a ton of `export` commands. They specify settings for other programs, most of which are so they store their ~~files~~ junk somewhere else other than my `~`. More info can be found in [here](https://wiki.archlinux.org/title/XDG_Base_Directory). 


```zsh
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"

# Thousands of exports
# ...
```

We mustn't forget to automatically start X11 if the shell is being started in the first tty.
```zsh 
## Launches X11 on session start
if [[ -z $DISPLAY ]] && [[ $(tty) = /dev/tty1 ]]; then
  startx "$XINITRC"
fi
``` 

### .zlogin

I found out that Zsh has the `zcompile` builtin to compile Zsh files so I thought I could compile my dotfiles at startup. My config is very minimal though and so far I haven't noticed any performance improvements, however given that the execution is asynchronous, it shouldn't impact startup either. Personally, I just keep it because I find it funny. It's also worth notable that I only recompile files that have changed since the last compilation.

```zsh
zcompare() {
  if [[ -s ${1} && ( ! -s ${1}.zwc || ${1} -nt ${1}.zwc) ]]; then
    zcompile ${1}
  fi
}

emulate zsh -o extended_glob -c "local files=($ZDOTDIR/*/*.zsh)"
for file in "${files[@]}"; do
  zcompare $file
done

zcompare .zshrc
``` 

Compiling a file will generate a `.zwc` file that will be automatically sourced instead of the original.

### .zshrc

`.zshrc` is the most important file of all, it establishes preferences, loads and configures plugins, and sets the prompt. In my case, it begins by loading my `utils` module, and setting some base settings, such as history: 

```zsh
# General Setting foldstart
source "$ZDOTDIR/utils/utils.zsh"

# History in cache directory:
HISTSIZE=50000
SAVEHIST=50000
HISTFILE="$XDG_CACHE_HOME"/zsh/history

# Clear default keybinds
clear-keybinds
```

I also generate / load completions and configure its behaviour: 
```zsh
# Basic auto/tab complete:
autoload -U compinit
zmodload zsh/complist
zstyle ':completion:*' menu select

# Include hidden files.
_comp_options+=(globdots)		

# Autocomplete from the middle of the word
zstyle ':completion:*' matcher-list 'r:|=*' 'l:|=* r:|=*'
compinit
```

##### Plugins

I made my own function for loading plugins. Right now, because all of them are distributed as AUR packages, I rely on my system's package manager instead of using a plugin manager. Why? Because, in my experience, they are slow, and I have very basic needs. I will probably, at some point, write a function that actually clones / updates the plugins to avoid relying on my distro. For now, however, this works.

The plugins that I'm currently using are: 

```zsh 
# Suggestions while typing commands
load-plugin    "zsh-autosuggestions"

# Syntax highlighting for commands
load-plugin    "fast-syntax-highlighting"

# Better history search
load-plugin    "zsh-history-substring-search"   

# Reminder to use aliases 
load-plugin    "zsh-you-should-use" 
```

##### Modules

I've divided my config in several modules to make it more readable and organized, I'll get more into it below. For now, all that matters is that I source them simply with: 
```zsh
source "$ZDOTDIR/modules/functions.zsh"
source "$ZDOTDIR/modules/keybinds.zsh"
source "$ZDOTDIR/modules/prompt.zsh"
source "$ZDOTDIR/modules/alias.zsh"
```

###### Keybinds

One of the main things I wanted to try was Vi Mode. My past experiences with it have not been great but recently I found out [a post](https://superuser.com/questions/476532/how-can-i-make-zshs-vi-mode-behave-more-like-bashs-vi-mode) explaining how to fix some of its flaws:

The main problem is that Zsh's Vi mode has certain key combinations set to begin with `ESC`. For this reason, upon pressing it, Zsh will wait for a few seconds or swallow your next few keypresses.

So then, we shall unmap every keybind that starts with `ESC` and reduce the timeout for key chains to the minimum: 

```zsh
bindkey -v

export KEYTIMEOUT=1   
bindkey -M vicmd '^[' undefined-key

bindkey -M vicmd -r "^[OA"    # up-line-or-history
bindkey -M vicmd -r "^[OB"    # down-line-or-history
bindkey -M vicmd -r "^[OC"    # vi-forward-char
bindkey -M vicmd -r "^[OD"    # vi-backward-char
bindkey -M vicmd -r "^[[200~" # bracketed-paste
bindkey -M vicmd -r "^[[A"    # up-line-or-history
bindkey -M vicmd -r "^[[B"    # down-line-or-history
bindkey -M vicmd -r "^[[C"    # vi-forward-char
bindkey -M vicmd -r "^[[D"    # vi-backward-char
```

A few other tweaks I like to do are: removing the `:` keybind because so I don't accidentally press it, and set `backspace` to its normal behaviour regardless of the mode I'm in. (Otherwise, in normal mode, it would just position the cursor backwards without removing the text).

```zsh 
bindkey -M vicmd -r ":"       

bindkey "^?" backward-delete-char
```

I also like to be able to move through my completion menu's using the home row:
```zsh
bindkey -M menuselect '^J' vi-down-line-or-history
bindkey -M menuselect '^K' vi-up-line-or-history
bindkey -M menuselect '^H' vi-backward-char
bindkey -M menuselect '^L' vi-forward-char
```

I rather use `history-substring-search`, instead of the normal history bindings, so I remove them and instead set my own: 

```zsh 
# Remove defaults
bindkey -rM viins '^X'
bindkey -M viins '^X,' _history-complete-newer \
                 '^X/' _history-complete-older \
                 '^X`' _bash_complete-word 

# Set my own
bindkey -M viins '^[[A' history-substring-search-up    # Arrow up
bindkey -M viins '^[[B' history-substring-search-down  # Arrow down
bindkey -M vicmd '^K'   history-substring-search-up    
bindkey -M viins '^K'   history-substring-search-up    
bindkey -M vicmd 'k'   history-substring-search-up    
bindkey -M vicmd '^J'   history-substring-search-down  
bindkey -M vicmd 'j'   history-substring-search-down  
bindkey -M viins '^J'   history-substring-search-down  
```

Finally, I set a few more convenient keybinds and disable those annoying Ctrl+S/ Ctrl+Q binds.
```zsh
# / to search through history
bindkey -M vicmd '/' fzf-history

# C-Q to edit command in $EDITOR
autoload -U edit-command-line
zle -N edit-command-line
bindkey -M viins "^Q" edit-command-line
bindkey -M vicmd "^Q" edit-command-line

setopt NO_FLOW_CONTROL  # Disable Ctrl+S and Ctrl+Q 
```
###### Prompt

I won't go into full detail about my prompt, if you're interested you might want to take a look at its [source file](https://github.com/druskus20/dots/blob/master/zsh/.config/zsh/modules/prompt.zsh). 

I mainly want to have a Vi Mode indicator 

```zsh
function zle-line-init zle-keymap-select {
    case $KEYMAP in
      vicmd)      VI_INDICATOR="%{$fg[magenta]%}"   ;;
      main|viins) VI_INDICATOR="%{$fg[blue]%}ﴨ"   ;;
    esac
    zle reset-prompt
}

zle -N zle-line-init
zle -N zle-keymap-select
```

I also want to overwrite the default virtualenv indicator, we can do so by setting `VIRTUAL_ENV_DISABLE_PROMPT` and defining our own:

```zsh
function virtenv_indicator {
    if [[ -z $VIRTUAL_ENV ]] then
        VIRTUAL_ENV_INDICATOR=''
    else
        VIRTUAL_ENV_INDICATOR=" ${VIRTUAL_ENV##*/} "
    fi
}

autoload -Uz add-zsh-hook
add-zsh-hook precmd virtenv_indicator

# Disable default virtualenv prompt
export VIRTUAL_ENV_DISABLE_PROMPT=1 
```

And finally I configure a function to get [gitstatus](https://github.com/romkatv/gitstatus) information which I won't get into here. Just know that I decided to use `gitstatus` over other alternatives because its fast and async, specially noticeable in larger repos.

##### Options

At the end of the file, I set my preferred options. Zsh offers a wide variety of [options](https://zsh.sourceforge.io/Doc/Release/Options.html) that let you tweak how the shell behaves. These are mine:

```zsh
# automatically list choices on ambiguous completion
setopt AUTO_LIST               
# show completion menu on a successive tab press
setopt AUTO_MENU               
# if completed parameter is a directory, add a trailing slash
setopt AUTO_PARAM_SLASH        
# complete from the cursor rather than from the end of the word
setopt COMPLETE_IN_WORD        
# do not autoselect the first completion entry
setopt NO_MENU_COMPLETE        
setopt HASH_LIST_ALL
setopt ALWAYS_TO_END

# History
# dont store duplicate lines in the history file
setopt HIST_SAVE_NO_DUPS
setopt HIST_IGNORE_ALL_DUPS
# write and import history on every command
setopt SHARE_HISTORY             
setopt HIST_FIND_NO_DUPS 

# Other
# allow comments in command line
setopt INTERACTIVE_COMMENTS    
```

### Results

Overall I'm pretty happy with my current config. Movement and navigation have turned out to be really comfortable, and I'm glad I tried Vi Mode (though it took a while to figure out a fix for its multiple issues). As I mentioned earlier, the main thing that I still want to do is figure out a better way to manage plugins.


![Vi Mode](images/showcase-2.gif)
![Showcase](images/showcase-1.gif)
