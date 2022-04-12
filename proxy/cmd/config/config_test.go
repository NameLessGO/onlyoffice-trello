/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */

package config

import (
	"os"
	"testing"
)

func TestNewConfig(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		params  ConfigParameters
		withErr bool
	}{
		{
			name: "OK: Valid config from .env",
			params: ConfigParameters{
				Filename: "mock.yml",
				Type:     ConfigYML,
			},
			withErr: false,
		},
		{
			name: "Failure: No such .yml file",
			params: ConfigParameters{
				Filename: "none.yml",
				Type:     ConfigYML,
			},
			withErr: true,
		},
		{
			name: "Failure: No such file type",
			params: ConfigParameters{
				Filename: "mock.yml",
				Type:     "env",
			},
			withErr: true,
		},
	}

	for _, test := range tests {
		tt := test

		t.Run(tt.name, func(t *testing.T) {
			os.Setenv("PROXY_SECRET", "mockmockmockmockmockmockmockmock")
			if _, actualErr := NewConfig(tt.params); (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}
